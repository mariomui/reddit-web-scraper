const puppeteer = require('puppeteer');

const foo = () => new Promise((async (resolve, reject) => {
  try {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.goto('https://www.reddit.com/r/malelivingspace/');

    await page.waitFor(1000);

    const currTime = Date.now();
    let nextTime = currTime;
    while (nextTime < (currTime + 15000)) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      nextTime = Date.now();
    }
    browser.close();
  } catch (e) {
    return reject(e);
  }
}));

foo();
