const { test, expect } = require('@playwright/test');

test('Verify shuffle randomness over multiple starts', async ({ page }) => {
  await page.goto('http://localhost:8080');

  // Choose class
  await page.click('button:has-text("Bilgin")');

  const firstOptions = [];

  for (let i = 0; i < 5; i++) {
    // Start Fast Mode
    // The button text might be localized. In TR it is "BAŞLAT"
    await page.click('button:has-text("BAŞLAT")');

    // Wait for quiz screen
    await page.waitForSelector('.quiz-ans-btn');

    const options = await page.locator('.quiz-ans-btn span').allTextContents();
    console.log(`Trial ${i+1} - Options: ${options.join(', ')}`);
    firstOptions.push(options.join('|'));

    // Exit quiz
    await page.click('i.fa-times');
    await page.waitForTimeout(500);
  }

  const allSame = firstOptions.every(opt => opt === firstOptions[0]);
  if (allSame) {
    throw new Error('Shuffle is not working! Options are identical in all trials.');
  } else {
    console.log('Shuffle is working.');
  }
});
