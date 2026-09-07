// Debug: verificar estado de usuarios en auth.users
import { Client as PgClient } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

const envLocal = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
for (const line of envLocal.split("\n")) {
  const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2];
  }
}

const PROJECT_REF = "wmpnzqcmlkryzjhqmucg";
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD!;
const encodedPassword = encodeURIComponent(DB_PASSWORD);

const pg = new PgClient({
  connectionString: `postgresql://postgres.${PROJECT_REF}:${encodedPassword}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await pg.connect();
  console.log("🔍 Verificando usuarios en auth.users:\n");

  const res = await pg.query<{
    id: string;
    email: string;
    email_confirmed_at: Date | null;
    encrypted_password: string | null;
    created_at: Date;
    instance_id: string;
    aud: string;
    role: string;
  }>(`
    SELECT id, email, email_confirmed_at, encrypted_password,
           created_at, instance_id, aud, role
    FROM auth.users
    ORDER BY created_at DESC
  `);

  for (const u of res.rows) {
    console.log(`📧 ${u.email}`);
    console.log(`   id: ${u.id}`);
    console.log(`   confirmed: ${u.email_confirmed_at ? "✅ YES" : "❌ NO"}`);
    console.log(`   has password: ${u.encrypted_password ? "✅ YES (" + u.encrypted_password.substring(0, 20) + "...)" : "❌ NO"}`);
    console.log(`   created: ${u.created_at}`);
    console.log(`   instance_id: ${u.instance_id || "NULL ⚠️"}`);
    console.log(`   aud: ${u.aud} | role: ${u.role}`);
    console.log();
  }

  // Verificar identities
  console.log("\n🔍 Verificando identities:\n");
  const identRes = await pg.query(`
    SELECT user_id, provider, provider_id
    FROM auth.identities
    ORDER BY created_at DESC
  `);
  for (const i of identRes.rows) {
    console.log(`   user: ${i.user_id.substring(0, 8)}... | provider: ${i.provider} | provider_id: ${i.provider_id.substring(0, 8)}...`);
  }

  // Verificar profiles
  console.log("\n🔍 Verificando profiles:\n");
  const profRes = await pg.query(`
    SELECT id, display_name, goal, level, equipment_available
    FROM public.profiles
  `);
  for (const p of profRes.rows) {
    console.log(`   ${p.display_name} | goal: ${p.goal} | level: ${p.level} | equipment: ${JSON.stringify(p.equipment_available)}`);
  }

  await pg.end();
}

main().catch(console.error);
