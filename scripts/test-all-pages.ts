// Test E2E de TODAS las páginas
import { chromium } from "playwright";

const PROD_URL = "https://fitme-app-mocha.vercel.app";

interface PageResult {
  url: string;
  status: "OK" | "ERROR" | "REDIRECT";
  h1: string;
  errors: string[];
  bodyPreview: string;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const allErrors: string[] = [];
  page.on("pageerror", (e) => allErrors.push(`[pageerror] ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") allErrors.push(`[console] ${msg.text()}`);
  });

  // Login
  console.log("🔐 Login Gabriel...");
  await page.goto(`${PROD_URL}/login`, { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.fill('input[type="email"]', "gabriel@fitme.app");
  await page.fill('input[type="password"]', "Gabo2018$");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  console.log("✅ Login OK\n");

  // Test cada página
  const pagesToTest = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Biblioteca", path: "/exercises" },
    { name: "Ejercicio detalle", path: "/exercises/3_4_Sit-Up" },
    { name: "Progreso", path: "/progress" },
    { name: "Perfil", path: "/profile" },
    { name: "Sesión activa", path: "/workouts/session" },
    { name: "Onboarding equipos", path: "/onboarding/equipment" },
  ];

  const results: PageResult[] = [];
  for (const p of pagesToTest) {
    const startErrors = allErrors.length;
    console.log(`📄 ${p.name} (${p.path})...`);

    try {
      const resp = await page.goto(`${PROD_URL}${p.path}`, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });
      await page.waitForTimeout(1500);
      const status = resp?.status() ?? 0;
      const h1 = await page.locator("h1").first().textContent().catch(() => "(no h1)");
      const body = await page.locator("body").textContent().catch(() => "");
      const newErrors = allErrors.slice(startErrors);

      const result: PageResult = {
        url: p.path,
        status: status === 200 ? "OK" : status === 307 || status === 302 ? "REDIRECT" : "ERROR",
        h1: h1?.substring(0, 60) ?? "",
        errors: newErrors,
        bodyPreview: (body ?? "").substring(0, 150),
      };
      results.push(result);

      const statusIcon = result.status === "OK" ? "✅" : result.status === "REDIRECT" ? "↪️" : "❌";
      console.log(`   ${statusIcon} HTTP ${status} | H1: "${result.h1}"`);
      if (newErrors.length > 0) {
        console.log(`   ⚠️  ${newErrors.length} errores:`);
        for (const e of newErrors.slice(0, 3)) {
          console.log(`      - ${e.substring(0, 100)}`);
        }
      }
    } catch (err) {
      console.log(`   ❌ FAILED: ${(err as Error).message}`);
      results.push({
        url: p.path,
        status: "ERROR",
        h1: "",
        errors: [(err as Error).message],
        bodyPreview: "",
      });
    }
    console.log();
  }

  // Resumen
  console.log("\n═══════════════════════════════════════");
  console.log("📊 RESUMEN");
  console.log("═══════════════════════════════════════");
  const ok = results.filter((r) => r.status === "OK").length;
  const bad = results.filter((r) => r.status !== "OK").length;
  console.log(`✅ OK: ${ok}/${results.length}`);
  console.log(`❌ Issues: ${bad}/${results.length}`);
  if (bad > 0) {
    console.log("\nPáginas con problemas:");
    for (const r of results.filter((x) => x.status !== "OK")) {
      console.log(`  ${r.url}: ${r.status} | ${r.h1}`);
      for (const e of r.errors) console.log(`    - ${e.substring(0, 120)}`);
    }
  }

  await page.screenshot({ path: "/tmp/fitme-all-pages.png", fullPage: true });
  await browser.close();
  process.exit(bad > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
