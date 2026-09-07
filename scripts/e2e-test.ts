// Test E2E: abrir browser, ir a /login, escribir credenciales, click submit, ver qué pasa
import { chromium } from "playwright";

const APP_URL = process.env.TEST_URL || "http://localhost:3001";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar console
  page.on("console", (msg) => {
    console.log(`[browser ${msg.type()}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    console.log(`[browser error] ${err.message}`);
  });

  console.log(`\n🌐 Navegando a ${APP_URL}/login...`);
  await page.goto(`${APP_URL}/login`, { waitUntil: "networkidle" });

  console.log("📝 Llenando formulario...");
  await page.fill('input[type="email"]', "gabriel@fitme.app");
  await page.fill('input[type="password"]', "Gabo2018$");

  console.log("🖱️  Click 'Iniciar sesión'...");
  const startTime = Date.now();
  await page.click('button[type="submit"]');

  // Esperar navegación o error
  await page.waitForTimeout(5000);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n⏱️  ${elapsed}s después del submit`);
  console.log(`📍 URL actual: ${page.url()}`);

  // Ver si hay error visible
  const errorEl = await page.locator('[role="alert"]').first();
  if (await errorEl.count() > 0) {
    const errorText = await errorEl.textContent();
    console.log(`❌ Error en UI: ${errorText}`);
  }

  // Listar cookies
  const cookies = await context.cookies();
  console.log(`\n🍪 Cookies (${cookies.length}):`);
  for (const c of cookies) {
    console.log(`   ${c.name}=${c.value.substring(0, 30)}... (domain: ${c.domain})`);
  }

  // Ver localStorage
  const localStorage = await page.evaluate(() => {
    return Object.fromEntries(Object.entries(localStorage));
  });
  console.log(`\n💾 localStorage:`, JSON.stringify(localStorage).substring(0, 300));

  await page.screenshot({ path: "/tmp/fitme-login-test.png", fullPage: true });
  console.log("\n📸 Screenshot: /tmp/fitme-login-test.png");

  await browser.close();
}

main().catch(console.error);
