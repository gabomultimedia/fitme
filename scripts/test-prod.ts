import { chromium } from "playwright";

const PROD_URL = "https://fitme-app-mocha.vercel.app";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("pageerror", (err) => console.log(`[browser error] ${err.message}`));

  console.log(`🌐 Test contra PRODUCCIÓN: ${PROD_URL}\n`);

  for (const user of [
    { email: "gabriel@fitme.app", pass: "Gabo2018$", name: "Gabriel" },
    { email: "vero@fitme.app", pass: "Vero2018$", name: "Verónica" },
  ]) {
    console.log(`--- ${user.name} ---`);
    await page.goto(`${PROD_URL}/login`, { waitUntil: "networkidle", timeout: 30000 });
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[type="password"]', user.pass);
    await page.click('button[type="submit"]');

    await page.waitForURL("**/dashboard", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    const url = page.url();
    if (url.includes("/dashboard")) {
      const h1 = await page.locator("h1").first().textContent().catch(() => "(no h1)");
      console.log(`   ✅ ${url}`);
      console.log(`   H1: "${h1}"`);
    } else {
      console.log(`   ❌ URL: ${url}`);
    }
    console.log();

    // Logout
    await page.goto(`${PROD_URL}/api/auth/logout`, { waitUntil: "networkidle" }).catch(() => {});
    await page.context().clearCookies();
  }

  await browser.close();
  console.log("🎉 Test completo");
}

main().catch((e) => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});
