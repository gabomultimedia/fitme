// Script para crear los 2 usuarios fijos de FitMe (Gabriel + Verónica)
// Usa el cliente público de Supabase para signUp, luego confirma emails via SQL directo.

import { createClient } from "@supabase/supabase-js";
import { Client as PgClient } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

// Cargar .env.local manualmente (mejor que dotenv con tsx)
const envLocal = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
for (const line of envLocal.split("\n")) {
  const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2];
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD!;
const PROJECT_REF = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "");

const USERS = [
  { email: "gabriel@fitme.app", password: "Gabo2018$", name: "Gabriel" },
  { email: "vero@fitme.app", password: "Vero2018$", name: "Verónica" },
];

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  for (const u of USERS) {
    console.log(`\n📝 Creando ${u.email}...`);

    // 1) Intentar signUp
    const { data, error } = await supabase.auth.signUp({
      email: u.email,
      password: u.password,
      options: { data: { display_name: u.name } },
    });

    if (error && !error.message.includes("already registered")) {
      console.error(`   ❌ Error: ${error.message}`);
      continue;
    }

    if (error?.message.includes("already registered")) {
      console.log(`   ℹ️  Usuario ya existe, skip signUp`);
    } else {
      console.log(`   ✅ SignUp OK (id: ${data.user?.id})`);
    }
  }

  // 2) Confirmar emails via SQL directo
  console.log("\n🔓 Confirmando emails vía SQL...");
  const encodedPassword = encodeURIComponent(DB_PASSWORD);
  const pg = new PgClient({
    connectionString: `postgresql://postgres.${PROJECT_REF}:${encodedPassword}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
    ssl: { rejectUnauthorized: false },
  });

  await pg.connect();
  for (const u of USERS) {
    // Confirmar email
    await pg.query(
      `UPDATE auth.users
       SET email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
           updated_at = NOW()
       WHERE email = $1`,
      [u.email]
    );
    console.log(`   ✅ ${u.email} confirmado`);

    // Asegurar profile
    const userRes = await pg.query<{ id: string }>(
      `SELECT id FROM auth.users WHERE email = $1`,
      [u.email]
    );
    if (userRes.rows[0]) {
      await pg.query(
        `INSERT INTO public.profiles (id, display_name, goal, level, equipment_available)
         VALUES ($1, $2, 'both', 'beginner', '{}')
         ON CONFLICT (id) DO UPDATE
           SET display_name = EXCLUDED.display_name,
               updated_at = NOW()`,
        [userRes.rows[0].id, u.name]
      );
      console.log(`   ✅ Profile creado/actualizado para ${u.name}`);
    }
  }
  await pg.end();

  console.log("\n🎉 Listo. Credenciales:");
  for (const u of USERS) {
    console.log(`   ${u.email} / ${u.password}`);
  }
}

main().catch((err) => {
  console.error("❌ Error fatal:", err);
  process.exit(1);
});
