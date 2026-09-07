// Script para aplicar las migraciones SQL a Supabase via conexión directa Postgres
// Ejecutar con: npx tsx scripts/apply-migrations.ts

import { Client } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

const PROJECT_REF = "wmpnzqcmlkryzjhqmucg";
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || "d9#!&A^gDjMOdXvGEy1Qu";

// URL-encode password (# → %23, ! → %21, & → %26, ^ → %5E)
const encodedPassword = encodeURIComponent(DB_PASSWORD);
// Usar pooler Transaction mode (IPv4 + puerto 6543) que es lo recomendado en Supabase
// porque el DNS directo db.PROJECTREF.supabase.co no resuelve en algunos setups
const connectionString = `postgresql://postgres.${PROJECT_REF}:${encodedPassword}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

const MIGRATIONS = [
  "supabase/migrations/0001_initial_schema.sql",
  "supabase/migrations/0002_rls_policies.sql",
  "supabase/migrations/0003_storage_policies.sql",
];

async function main() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  try {
    console.log("Conectando a Supabase...");
    await client.connect();
    console.log("✅ Conectado\n");

    for (const file of MIGRATIONS) {
      const sql = readFileSync(join(process.cwd(), file), "utf-8");
      console.log(`📄 Aplicando ${file}...`);
      try {
        await client.query(sql);
        console.log(`✅ ${file} aplicada\n`);
      } catch (err: unknown) {
        const error = err as { message?: string; code?: string };
        if (error.message?.includes("already exists") || error.code === "42710" || error.code === "42P07" || error.code === "42701") {
          console.log(`⚠️  ${file} parcialmente aplicada (objetos ya existían)\n`);
        } else {
          console.error(`❌ Error en ${file}:`, error.message);
          throw err;
        }
      }
    }

    // Verificar
    console.log("🔍 Verificando tablas creadas:");
    const res = await client.query(`
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);
    for (const row of res.rows) {
      const rlsIcon = row.rowsecurity ? "🔒" : "⚠️ ";
      console.log(`   ${rlsIcon} ${row.tablename} (RLS: ${row.rowsecurity})`);
    }
  } catch (err) {
    console.error("❌ Error fatal:", err);
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n🔌 Desconectado");
  }
}

main();
