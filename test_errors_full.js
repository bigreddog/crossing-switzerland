const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Fill input to trigger calculator
  await page.fill('#target-time', '85');
  await page.waitForTimeout(500);

  // Click section row
  await page.click('.section-row');
  await page.waitForTimeout(500);

  await browser.close();
})();
