const puppeteer = require('puppeteer-core');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'; // adjust if needed

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => {
    logs.push(msg.text());
  });

  await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#district', { timeout: 15000 });
  // give React a moment to render options
  await page.waitForTimeout(2000);
  const optionCount = await page.evaluate(() => {
    const sel = document.querySelector('#district');
    return sel ? sel.querySelectorAll('option').length : 0;
  });
  const innerHTML = await page.evaluate(() => {
    const sel = document.querySelector('#district');
    return sel ? sel.innerHTML : '';
  });
  console.log('OPTION_COUNT:', optionCount);
  console.log('SELECT_INNERHTML:', innerHTML);
  console.log('--- PAGE CONSOLE LOGS ---');
  logs.forEach(l => console.log(l));
  await browser.close();
})();
