// Script de migración única: db.json → PostgreSQL
// Ejecutar una sola vez: node db/migrate.js
import 'dotenv/config';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initDb, findUserByNombre, createUser, insertAnalisis, pool } from './client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'db.json');

async function migrate() {
  console.log('🔄 Iniciando migración db.json → PostgreSQL...');
  await initDb();

  if (!existsSync(DB_PATH)) {
    console.log('ℹ️  No se encontró db.json — no hay nada que migrar.');
    return;
  }

  const data = JSON.parse(readFileSync(DB_PATH, 'utf8'));
  const usuarios = data.users || [];
  const analisis  = data.analisis || [];

  console.log(`   Usuarios encontrados: ${usuarios.length}`);
  console.log(`   Análisis encontrados: ${analisis.length}`);

  // Migrar usuarios
  for (const u of usuarios) {
    const existe = await findUserByNombre(u.nombre.toLowerCase());
    if (!existe) {
      await createUser(u);
      console.log(`   ✅ Usuario migrado: ${u.nombre}`);
    } else {
      console.log(`   ⏭️  Usuario ya existe: ${u.nombre}`);
    }
  }

  // Migrar análisis
  for (const a of analisis) {
    try {
      await insertAnalisis({
        ...a,
        fotos: a.fotos || (a.foto ? [a.foto] : []),
        tipoTiendaDeclarado: a.tipoTiendaDeclarado || null,
        notas:               a.notas || null,
        vendedorAsignado:    a.vendedorAsignado || null,
      });
      console.log(`   ✅ Análisis migrado: ${a.farmacia} (${a.fecha?.split('T')[0]})`);
    } catch (err) {
      if (err.code === '23505') {
        console.log(`   ⏭️  Ya existe: ${a.farmacia}`);
      } else {
        console.error(`   ❌ Error en ${a.farmacia}:`, err.message);
      }
    }
  }

  console.log('✅ Migración completada.');
}

migrate()
  .catch(err => { console.error('❌ Error fatal:', err.message); process.exit(1); })
  .finally(() => pool.end());
