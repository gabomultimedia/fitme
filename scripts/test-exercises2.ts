import { chromium } from "playwright";
const PROD_URL = "https://fitme-app-mocha.vercel.app";
async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log(`[ERR] ${e.message}`));
  page.on("response", (r) => { if (!r.ok() && r.status() !== 304) console.log(`[${r.status()}] ${r.url()}`); });

  await page.goto(`${PROD_URL}/login`, { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.fill('input[type="email"]', "gabriel@fitme.app");
  await page.fill('input[type="password"]', "Gabo2018$");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 15000 });

  console.log("→ /exercises");
  await page.goto(`${PROD_URL}/exercises`, { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(2000);
  const h1 = await page.locator("h1").first().textContent().catch(() => "(none)");
  const text = await page.locator("body").textContent();
  console.log(`H1: "${h1}"`);
  console.log(`Body (500c): ${text?.substring(0, 500)}`);
  await browser.close();
}
main().catch((e) => { console.error("FATAL", e.message); process.exit(1); });
