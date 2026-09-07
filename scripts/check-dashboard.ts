import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("console", (msg) => console.log(`[browser ${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => console.log(`[browser error] ${err.message}`));

  await page.goto("http://localhost:3001/login", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "gabriel@fitme.app");
  await page.fill('input[type="password"]', "Gabo2018$");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 10000 });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);

  // Ver el texto del H1
  const h1 = await page.locator("h1").first().textContent();
  console.log(`\n📍 H1 del dashboard: "${h1}"`);

  // Ver todo el HTML del main
  const main = await page.locator("main").first().innerHTML();
  console.log(`\n📄 Main content (primeros 800 chars):`);
  console.log(main.substring(0, 800));

  // Llamar a Supabase directamente desde el browser para ver qué devuelve
  const result = await page.evaluate(async () => {
    const supabase = (await import("/_next/static/chunks/main-app.js")).default;
    return "nope";
  }).catch((e) => `error: ${e.message}`);
  console.log(`\n🔍 Eval: ${result}`);

  await browser.close();
}

main().catch(console.error);
