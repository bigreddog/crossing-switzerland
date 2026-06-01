const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');

  // Wait for climbs table to be populated
  await page.waitForTimeout(2000);

  const climbsHTML = await page.$eval('#climbsTable', el => el.outerHTML);
  console.log(climbsHTML);

  await browser.close();
})();
