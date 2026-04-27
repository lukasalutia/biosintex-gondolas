import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import { readFileSync, mkdirSync, unlinkSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID, createHmac, timingSafeEqual } from 'crypto';
import Anthropic from '@anthropic-ai/sdk';
import rateLimit from 'express-rate-limit';
import fileTypePkg from 'file-type';
const { fromFile: fileTypeFromFile } = fileTypePkg;
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import 'dotenv/config';
import { buildSystemPrompt, buildUserPrompt, PORTFOLIO } from './knowledge/biosintex.js';
import {
  initDb,
  findUserByNombre,
  createUser,
  getAnalisisByUser,
  getAllAnalisis,
  insertAnalisis,
  deleteAnalisisById,
  getVendedoresConStats,
  getAnalisisByFarmacia,
  getAnalisisByFilter,
  getFarmacias,
  pool,
} from './db/client.js';

// ── Validación de entorno al inicio ────────────────────────────────────────
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('FATAL: ANTHROPIC_API_KEY no está definida. El servidor no puede arrancar.');
  process.exit(1);
}
if (!process.env.APP_PASSWORD) {
  console.warn('ADVERTENCIA: APP_PASSWORD no definida, usando valor por defecto inseguro.');
}
if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL no está definida. El servidor no puede arrancar.');
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const IS_PROD   = process.env.NODE_ENV === 'production';

// En Railway con Volume los uploads van a /data/uploads (persistente)
const UPLOADS_DIR = IS_PROD
  ? join('/data', 'uploads')
  : join(__dirname, 'uploads');

mkdirSync(UPLOADS_DIR, { recursive: true });

// ── Cloudflare R2 ──────────────────────────────────────────────────────────


const USE_R2 = !!(
  process.env.CLOUDFLARE_ACCOUNT_ID &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET_NAME
);

const r2 = USE_R2 ? new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
}) : null;

console.log(USE_R2 ? '✅ Cloudflare R2 habilitado' : '⚠️  R2 no configurado — usando almacenamiento local');

async function storeFile(file) {
  if (!USE_R2) return;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: file.filename,
    Body: readFileSync(file.path),
    ContentType: file.mimetype,
  }));
  try { unlinkSync(file.path); } catch {}
}

async function removeFile(filename) {
  if (USE_R2) {
    await r2.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: filename,
    }));
  } else {
    try { unlinkSync(join(UPLOADS_DIR, filename)); } catch {}
  }
}

// ── App ────────────────────────────────────────────────────────────────────
const app = express();
app.set('trust proxy', 1); // Railway usa proxy inverso

// Archivos estáticos PRIMERO — antes de cualquier middleware que pueda interferir
const clientDist = join(__dirname, '..', 'client', 'dist');
console.log('CLIENT_DIST:', clientDist, '| EXISTS:', existsSync(clientDist));
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-site' },
  contentSecurityPolicy: false, // Desactivado: el frontend ya tiene sus propios assets locales
}));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:4173')
  .split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin && !IS_PROD) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Origen no permitido por CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '50kb' }));

app.get('/uploads/:filename', async (req, res) => {
  const { filename } = req.params;
  if (!/^[\w.-]{1,200}$/.test(filename)) return res.status(400).end();
  if (USE_R2) {
    try {
      const obj = await r2.send(new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
      }));
      res.setHeader('Content-Type', obj.ContentType || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      obj.Body.pipe(res);
    } catch {
      res.status(404).end();
    }
  } else {
    const filePath = join(UPLOADS_DIR, filename);
    if (existsSync(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.sendFile(filePath);
    } else {
      res.status(404).end();
    }
  }
});

// ── Rate limiters ──────────────────────────────────────────────────────────
const analisisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Demasiadas solicitudes. Intentá en una hora.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos. Esperá 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Multer: upload seguro ──────────────────────────────────────────────────
const ALLOWED_MIMETYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (req, file, cb) => {
      const ext = file.originalname.match(/\.(jpe?g|png|webp|heic|heif)$/i)?.[0]?.toLowerCase() || '.jpg';
      cb(null, `${randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 30 * 1024 * 1024, files: 3 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMETYPES.has(file.mimetype)) return cb(null, true);
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes JPG, PNG o WebP.'));
  },
});

async function validateImageFiles(files) {
  for (const file of files) {
    const type = await fileTypeFromFile(file.path);
    if (!type || !ALLOWED_MIMETYPES.has(type.mime)) {
      unlinkSync(file.path);
      throw new Error(`El archivo "${file.originalname}" no es una imagen válida.`);
    }
  }
}

// ── Claude client ──────────────────────────────────────────────────────────
const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const SYSTEM_PROMPT = buildSystemPrompt();

function parseJson(text) {
  try { return JSON.parse(text.trim()); } catch {}
  const stripped = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  try { return JSON.parse(stripped); } catch {}
  const match = stripped.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  throw new Error('No JSON found in response');
}

// ── Validación de inputs ───────────────────────────────────────────────────
function sanitizeStr(val, maxLen = 200) {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

function isValidId(id) {
  return typeof id === 'string' && /^[\w-]{1,64}$/.test(id);
}

// ── Token auth (HMAC-SHA256, stateless) ────────────────────────────────────
const TOKEN_SECRET = process.env.JWT_SECRET || (() => {
  const s = randomUUID();
  console.warn('⚠️  JWT_SECRET no definido — los tokens expiran al reiniciar. Agregá JWT_SECRET en Railway.');
  return s;
})();

function issueToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig  = createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const dot  = token.lastIndexOf('.');
  if (dot === -1) return null;
  const data = token.slice(0, dot);
  const sig  = token.slice(dot + 1);
  try {
    const expected = createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url');
    const sigBuf   = Buffer.from(sig, 'base64url');
    const expBuf   = Buffer.from(expected, 'base64url');
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;
    return JSON.parse(Buffer.from(data, 'base64url').toString());
  } catch { return null; }
}

// ── Usuarios autorizados ───────────────────────────────────────────────────
let USER_MAP;
if (process.env.USERS_JSON) {
  try {
    const users = JSON.parse(process.env.USERS_JSON);
    USER_MAP = new Map(users.map(u => [u.nombre.toLowerCase(), { password: u.password, puesto: u.puesto }]));
    console.log(`✅ ${users.length} usuario${users.length !== 1 ? 's' : ''} cargado${users.length !== 1 ? 's' : ''} desde USERS_JSON`);
  } catch {
    console.error('FATAL: USERS_JSON no es JSON válido');
    process.exit(1);
  }
} else {
  USER_MAP = new Map([
    ['eduardo bologna', { password: process.env.APP_PASSWORD || 'Ofar', puesto: 'Gerente' }],
  ]);
  console.warn('⚠️  USERS_JSON no definido — solo Eduardo Bologna puede ingresar.');
}

// ── Middleware de autenticación ────────────────────────────────────────────
function requireAuth(req, res, next) {
  const token   = req.headers.authorization?.replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'No autenticado' });
  req.session = payload;
  next();
}

function requireGerente(req, res, next) {
  if (req.session?.puesto !== 'Gerente') return res.status(403).json({ error: 'Sin permisos' });
  next();
}

// ── Rutas ──────────────────────────────────────────────────────────────────

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/login', loginLimiter, async (req, res) => {
  const nombre   = sanitizeStr(req.body.nombre, 100);
  const password = sanitizeStr(req.body.password, 100);

  if (!nombre || !password)
    return res.status(400).json({ error: 'Nombre y contraseña requeridos' });

  const nombreNorm = nombre.toLowerCase();
  const userConfig = USER_MAP.get(nombreNorm);
  if (!userConfig || userConfig.password !== password)
    return res.status(401).json({ error: 'Credenciales incorrectas' });

  try {
    let user = await findUserByNombre(nombreNorm);
    if (!user) {
      user = { id: randomUUID(), nombre, puesto: userConfig.puesto, creadoEn: new Date().toISOString() };
      await createUser(user);
    }
    const sessionToken = issueToken({ userId: user.id, puesto: userConfig.puesto });
    res.json({ ...user, sessionToken });
  } catch (err) {
    console.error('Login DB error:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/analisis/:id', requireAuth, async (req, res) => {
  if (!isValidId(req.params.id))
    return res.status(400).json({ error: 'ID inválido' });

  try {
    const resultado = await deleteAnalisisById(req.params.id);
    if (!resultado) return res.status(404).json({ error: 'No encontrado' });

    const fotosABorrar = resultado.fotos?.length
      ? resultado.fotos
      : resultado.foto ? [resultado.foto] : [];
    await Promise.allSettled(fotosABorrar.map(f => removeFile(f)));

    res.json({ ok: true });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/analisis', analisisLimiter, requireAuth, upload.array('fotos', 3), async (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ error: 'Al menos una foto es requerida' });

  try {
    await validateImageFiles(req.files);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const farmacia            = sanitizeStr(req.body.farmacia, 150);
  const userId              = sanitizeStr(req.body.userId, 64);
  const userName            = sanitizeStr(req.body.userName, 100);
  const tipoTiendaDeclarado = ['A','B','C'].includes(req.body.tipoTiendaDeclarado)
    ? req.body.tipoTiendaDeclarado : null;
  const notas               = sanitizeStr(req.body.notas, 500);
  const vendedorAsignado    = sanitizeStr(req.body.vendedorAsignado, 100);

  if (!farmacia) return res.status(400).json({ error: 'Nombre de farmacia requerido' });
  if (!userId)   return res.status(400).json({ error: 'userId requerido' });

  const imageContents = req.files.map(f => ({
    type: 'image',
    source: {
      type: 'base64',
      media_type: f.mimetype,
      data: readFileSync(f.path).toString('base64'),
    },
  }));

  // Subir fotos a R2 (o dejar en disco local si R2 no está configurado)
  try {
    await Promise.all(req.files.map(storeFile));
  } catch (err) {
    console.error('Error subiendo imágenes:', err.message);
    return res.status(500).json({ error: 'Error guardando las imágenes' });
  }

  // Contexto histórico de visitas previas a esta farmacia
  let historialPrevio = [];
  try {
    historialPrevio = (await getAnalisisByFarmacia(farmacia)).slice(0, 3);
  } catch {}

  try {
    const message = await claude.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: [
          ...imageContents,
          { type: 'text', text: buildUserPrompt(farmacia, tipoTiendaDeclarado, notas || null, req.files.length, historialPrevio) },
        ],
      }],
    });

    const raw = message.content[0].text;

    let analisis;
    try {
      analisis = parseJson(raw);
    } catch {
      console.error('JSON parse error. Raw snippet:', raw.substring(0, 400));
      return res.status(500).json({ error: 'Error procesando respuesta de IA' });
    }

    const fotos = req.files.map(f => f.filename);
    const registro = {
      id:                  randomUUID(),
      userId,
      userName,
      farmacia,
      tipoTiendaDeclarado,
      notas:               notas || null,
      vendedorAsignado:    vendedorAsignado || null,
      foto:                fotos[0],
      fotos,
      analisis,
      fecha:               new Date().toISOString(),
    };
    await insertAnalisis(registro);
    res.json(registro);

  } catch (err) {
    console.error('Error en análisis:', err.message);
    res.status(500).json({ error: IS_PROD ? 'Error interno del servidor' : err.message });
  }
});

app.get('/api/historial/:userId', requireAuth, async (req, res) => {
  if (!isValidId(req.params.userId))
    return res.status(400).json({ error: 'ID inválido' });

  try {
    const items = await getAnalisisByUser(req.params.userId);
    res.json(items);
  } catch (err) {
    console.error('Historial error:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/vendedores', requireAuth, async (req, res) => {
  try {
    const result = await getVendedoresConStats();
    res.json(result);
  } catch (err) {
    console.error('Vendedores error:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/farmacias', requireAuth, async (req, res) => {
  try {
    const farmacias = await getFarmacias();
    res.json(farmacias);
  } catch (err) {
    console.error('Farmacias error:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/historial-vendedor/:userId', requireAuth, requireGerente, async (req, res) => {
  if (!isValidId(req.params.userId))
    return res.status(400).json({ error: 'ID inválido' });

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.userId]);
    const userRow = rows[0];
    if (!userRow) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = { id: userRow.id, nombre: userRow.nombre, puesto: userRow.puesto, creadoEn: userRow.creado_en };
    const historial = await getAnalisisByUser(req.params.userId);
    res.json({ user, historial });
  } catch (err) {
    console.error('Historial vendedor error:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/analisis-org', analisisLimiter, requireAuth, requireGerente, async (req, res) => {
  try {
    const { vendedores, farmacias, fechaDesde, fechaHasta } = req.body || {};
    const allAnalisis = await getAnalisisByFilter({ vendedores, farmacias, fechaDesde, fechaHasta });
    if (allAnalisis.length === 0)
      return res.status(400).json({ error: 'No hay análisis para los filtros seleccionados' });

    const resumen = allAnalisis.map(a => ({
      farmacia:            a.farmacia,
      vendedor:            a.userName,
      fecha:               a.fecha.split('T')[0],
      tipoGondola:         a.analisis.tipoGondola || 'desconocido',
      tipoTienda:          a.analisis.tipoTienda  || 'desconocido',
      puntaje:             a.analisis.puntajeTotal,
      productosDetectados: a.analisis.productosDetectados?.length || 0,
      skusFaltantes:       a.analisis.skusFaltantes || [],
      criterios:           a.analisis.criterios?.map(c => ({ nombre: c.nombre, puntaje: c.puntaje })) || [],
    }));

    const portfolioOTC = [...PORTFOLIO.otc.hereos, ...PORTFOLIO.otc.infaltables, ...PORTFOLIO.otc.innovacion].map(p => p.sku);
    const portfolioCos = [...PORTFOLIO.cosmetica.hereos, ...PORTFOLIO.cosmetica.infaltables, ...PORTFOLIO.cosmetica.innovacion].map(p => p.sku);

    const prompt = `Sos un consultor senior de Biosintex. Analizá los datos de auditorías de góndola del equipo de ventas y generá un análisis organizacional.

Portfolio OTC Biosintex: ${portfolioOTC.join(', ')}
Portfolio Cosmética Biosintex: ${portfolioCos.join(', ')}

Datos de auditorías:
${JSON.stringify(resumen, null, 2)}

Devolvé ÚNICAMENTE un JSON válido con esta estructura:

{
  "resumenEjecutivo": "<párrafo ejecutivo>",
  "puntajePromedioRed": <número>,
  "farmacias": [
    {
      "nombre": "<nombre>",
      "tipoTienda": "A|B|C|desconocido",
      "tipoGondola": "otc|cosmetica|mixta|desconocido",
      "puntajePromedio": <número>,
      "cantidadVisitas": <número>,
      "skusFaltantesFrecuentes": ["<SKU>"],
      "fortalezas": ["<...>"],
      "oportunidades": ["<...>"],
      "estado": "optimo|bueno|regular|critico"
    }
  ],
  "rankingCriterios": [{ "criterio": "<nombre>", "promedioRed": <número> }],
  "skusCriticos": [{ "sku": "<nombre>", "vecesAusente": <número>, "impacto": "alto|medio|bajo" }],
  "alertas": ["<situaciones críticas>"],
  "recomendacionesGlobales": ["<rec 1>", "<rec 2>", "<rec 3>"]
}`;

    const message = await claude.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2500,
      temperature: 0,
      system: 'Respondés ÚNICAMENTE con JSON puro. Sin texto antes ni después, sin markdown. Solo el objeto JSON empezando con { y terminando con }.',
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text;
    try {
      res.json(parseJson(raw));
    } catch {
      res.status(500).json({ error: 'Error procesando respuesta' });
    }
  } catch (err) {
    res.status(500).json({ error: IS_PROD ? 'Error interno del servidor' : err.message });
  }
});

// SPA fallback — todas las rutas no-API sirven el index.html
if (existsSync(clientDist)) {
  app.get('*', (req, res) => res.sendFile(join(clientDist, 'index.html')));
} else {
  console.warn('client/dist no encontrado — frontend no servido');
}

// ── Manejador global de errores ────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: IS_PROD ? 'Error interno del servidor' : err.message });
});

// ── Arranque ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Biosintex en http://localhost:${PORT} [${IS_PROD ? 'PRODUCCIÓN' : 'desarrollo'}]`);
    });
  })
  .catch(err => {
    console.error('FATAL: No se pudo inicializar la base de datos:', err.message);
    process.exit(1);
  });
