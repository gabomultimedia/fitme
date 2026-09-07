import { chromium } from "playwright";
async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newContext().then(c => c.newPage());
  await page.goto("https://fitme-app-mocha.vercel.app/login", { waitUntil: "load", timeout: 30000 });
  await page.fill('input[type="email"]', "gabriel@fitme.app");
  await page.fill('input[type="password"]', "Gabo2018$");
  await page.click('button[type="submit"]');
  // No waitForURL, just check after 8s
  await page.waitForTimeout(8000);
  console.log("URL:", page.url());
  const text = await page.locator("body").textContent();
  console.log("Body:", text?.substring(0, 300));
  await browser.close();
}
main().catch(console.error);
