const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/register', {waitUntil: 'networkidle2'});

  // Wait for the select element to be present
  await page.waitForSelector('#district', {timeout: 15000});

  // Get number of <option> elements inside the select
  const optionCount = await page.evaluate(() => {
    const select = document.querySelector('#district');
    return select ? select.querySelectorAll('option').length : 0;
  });

  // Get the innerHTML of the select
  const innerHTML = await page.evaluate(() => {
    const select = document.querySelector('#district');
    return select ? select.innerHTML : '';
  });

  // Capture screenshot of the select area
  const selectHandle = await page.$('#district');
  await selectHandle.screenshot({path: 'district_select.png'});

  console.log('OPTION_COUNT:', optionCount);
  console.log('SELECT_INNERHTML:', innerHTML);

  await browser.close();
})();
