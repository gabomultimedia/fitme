import { chromium } from "playwright";

const PROD_URL = "https://fitme-app-mocha.vercel.app";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("pageerror", (err) => console.log(`[pageerror] ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log(`[console error] ${msg.text()}`);
  });

  console.log("🔐 Login como Gabriel...");
  await page.goto(`${PROD_URL}/login`, { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "gabriel@fitme.app");
  await page.fill('input[type="password"]', "Gabo2018$");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 15000 });

  console.log("\n📍 Navegando a /exercises...");
  await page.goto(`${PROD_URL}/exercises`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log(`URL: ${page.url()}`);
  const h1 = await page.locator("h1").first().textContent().catch(() => "(no h1)");
  const main = await page.locator("main").first().textContent().catch(() => "(no main)");
  console.log(`H1: "${h1}"`);
  console.log(`\nMain textContent (primeros 1000 chars):`);
  console.log(main?.substring(0, 1000));

  await page.screenshot({ path: "/tmp/fitme-exercises.png", fullPage: true });
  console.log("\n📸 Screenshot: /tmp/fitme-exercises.png");

  await browser.close();
}

main().catch(console.error);
