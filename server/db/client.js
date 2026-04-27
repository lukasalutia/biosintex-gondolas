import pg from 'pg';
const { Pool } = pg;

const IS_PROD = process.env.NODE_ENV === 'production';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: IS_PROD ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err.message);
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      nombre      TEXT NOT NULL,
      puesto      TEXT NOT NULL,
      creado_en   TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS analisis (
      id                      TEXT PRIMARY KEY,
      user_id                 TEXT NOT NULL,
      user_name               TEXT,
      farmacia                TEXT NOT NULL,
      tipo_tienda_declarado   TEXT,
      notas                   TEXT,
      vendedor_asignado       TEXT,
      foto                    TEXT,
      fotos                   JSONB    DEFAULT '[]',
      analisis_data           JSONB    NOT NULL,
      fecha                   TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_analisis_user_id ON analisis(user_id);
    CREATE INDEX IF NOT EXISTS idx_analisis_fecha   ON analisis(fecha DESC);
  `);
  console.log('✅ Base de datos inicializada');
}

// ── Helpers ────────────────────────────────────────────────────────────────
function mapRow(row) {
  return {
    id:                   row.id,
    userId:               row.user_id,
    userName:             row.user_name,
    farmacia:             row.farmacia,
    tipoTiendaDeclarado:  row.tipo_tienda_declarado,
    notas:                row.notas,
    vendedorAsignado:     row.vendedor_asignado,
    foto:                 row.foto,
    fotos:                row.fotos || [],
    analisis:             row.analisis_data,
    fecha:                row.fecha instanceof Date ? row.fecha.toISOString() : row.fecha,
  };
}

// ── Users ──────────────────────────────────────────────────────────────────
export async function findUserByNombre(nombreNorm) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE LOWER(nombre) = $1',
    [nombreNorm]
  );
  return rows[0] || null;
}

export async function createUser(user) {
  await pool.query(
    'INSERT INTO users(id, nombre, puesto, creado_en) VALUES($1,$2,$3,$4) ON CONFLICT(id) DO NOTHING',
    [user.id, user.nombre, user.puesto, user.creadoEn || new Date().toISOString()]
  );
  return user;
}

export async function getVendedores() {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE puesto = 'Vendedor' ORDER BY nombre"
  );
  return rows.map(r => ({ id: r.id, nombre: r.nombre, puesto: r.puesto, creadoEn: r.creado_en }));
}

// ── Analisis ───────────────────────────────────────────────────────────────
export async function getAnalisisByUser(userId) {
  const { rows } = await pool.query(
    'SELECT * FROM analisis WHERE user_id = $1 ORDER BY fecha DESC',
    [userId]
  );
  return rows.map(mapRow);
}

export async function getAllAnalisis() {
  const { rows } = await pool.query('SELECT * FROM analisis ORDER BY fecha DESC');
  return rows.map(mapRow);
}

export async function insertAnalisis(registro) {
  await pool.query(
    `INSERT INTO analisis
       (id, user_id, user_name, farmacia, tipo_tienda_declarado, notas,
        vendedor_asignado, foto, fotos, analisis_data, fecha)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      registro.id,
      registro.userId,
      registro.userName,
      registro.farmacia,
      registro.tipoTiendaDeclarado,
      registro.notas,
      registro.vendedorAsignado,
      registro.foto,
      JSON.stringify(registro.fotos),
      JSON.stringify(registro.analisis),
      registro.fecha,
    ]
  );
  return registro;
}

export async function getAnalisisByFarmacia(farmacia) {
  const { rows } = await pool.query(
    'SELECT * FROM analisis WHERE LOWER(farmacia) = LOWER($1) ORDER BY fecha DESC',
    [farmacia]
  );
  return rows.map(mapRow);
}

export async function getFarmacias() {
  const { rows } = await pool.query(
    'SELECT DISTINCT farmacia FROM analisis ORDER BY farmacia ASC'
  );
  return rows.map(r => r.farmacia);
}

export async function getAnalisisByFilter({ vendedores, farmacias, fechaDesde, fechaHasta } = {}) {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (vendedores?.length) {
    conditions.push(`user_id = ANY($${idx++})`);
    params.push(vendedores);
  }
  if (farmacias?.length) {
    conditions.push(`LOWER(farmacia) = ANY($${idx++})`);
    params.push(farmacias.map(f => f.toLowerCase()));
  }
  if (fechaDesde) {
    conditions.push(`fecha >= $${idx++}`);
    params.push(fechaDesde);
  }
  if (fechaHasta) {
    conditions.push(`fecha <= $${idx++}`);
    params.push(new Date(fechaHasta + 'T23:59:59.999Z').toISOString());
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `SELECT * FROM analisis ${where} ORDER BY fecha DESC`,
    params
  );
  return rows.map(mapRow);
}

export async function deleteAnalisisById(id) {
  const { rows } = await pool.query(
    'SELECT foto, fotos FROM analisis WHERE id = $1',
    [id]
  );
  if (!rows.length) return null;
  await pool.query('DELETE FROM analisis WHERE id = $1', [id]);
  const row = rows[0];
  return { foto: row.foto, fotos: row.fotos || [] };
}

export async function getVendedoresConStats() {
  const vendedores = await getVendedores();
  const all = await getAllAnalisis();

  return vendedores.map(v => {
    const va = all.filter(a => a.userId === v.id);
    const sorted = [...va].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    const prom = va.length > 0
      ? (va.reduce((s, a) => s + (a.analisis?.puntajeTotal || 0), 0) / va.length).toFixed(1)
      : null;
    return {
      ...v,
      totalAnalisis:   va.length,
      puntajePromedio: prom,
      ultimaActividad: sorted[0]?.fecha || null,
    };
  });
}
