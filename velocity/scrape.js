import puppeteer from 'puppeteer';
import { createObjectCsvWriter } from 'csv-writer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page    = await browser.newPage();
  const results = [];
  let pageNum = 1;

  while (results.length < 100) {
    const url = `https://www.velocityincubator.com/companies?page=${pageNum}`;
    await page.goto(url, { waitUntil: 'networkidle2' });
    // Wait for the collection items to load
    await page.waitForSelector('div.collection-item-2.w-dyn-item', { timeout: 10000 });

    // Extract company cards
    const companies = await page.$$eval(
      'div.collection-item-2.w-dyn-item',
      cards => cards.map(card => {
        const nameEl = card.querySelector('div[fs-cmsfilter-field="company"]');
        const industryEls = card.querySelectorAll('div[fs-cmsfilter-field="Sector"]');
        const yearEl = card.querySelector('div[fs-cmsfilter-field="year"]');
        const linkEl = card.querySelector('a.company');

        const name = nameEl?.innerText.trim() || '';
        // Prefer second occurrence for desktop layout
        const industry = industryEls.length > 1
          ? industryEls[1].innerText.trim()
          : industryEls[0]?.innerText.trim() || '';
        const year = yearEl ? Number(yearEl.innerText.trim()) : 0;
        const detailUrl = linkEl?.href || '';

        return { name, industry, year, detailUrl };
      }).filter(c => c.year >= 2019)
    );

    for (const c of companies) {
      if (results.length >= 100) break;
      if (!c.detailUrl) continue;
      await page.goto(c.detailUrl, { waitUntil: 'networkidle2' });

      // Attempt to find email directly
      let contact = await page.$eval(
        'a[href^="mailto:"]',
        a => a.getAttribute('href')!.replace('mailto:', '')
      ).catch(() => '');

      let website = '';
      if (!contact) {
        website = await page.$eval(
          'a[href^="http"]',
          a => a.href
        ).catch(() => '');
        if (website) {
          const extPage = await browser.newPage();
          await extPage.goto(website, { waitUntil: 'networkidle2' });
          contact = await extPage.$eval(
            'a[href^="mailto:"]',
            a => a.getAttribute('href')!.replace('mailto:', '')
          ).catch(async () => 
            await extPage.$eval('a[href*="linkedin.com"]', a => a.href)
              .catch(() => '')
          );
          await extPage.close();
        }
      }

      results.push({ name: c.name, industry: c.industry, website, contact });
    }

    pageNum++;
  }

  await browser.close();

  // Write to CSV
  const csvWriter = createObjectCsvWriter({
    path: 'velocity_companies.csv',
    header: [
      {id:'name', title:'Name'},
      {id:'industry', title:'Industry'},
      {id:'website', title:'Website'},
      {id:'contact', title:'Contact'}
    ]
  });
  await csvWriter.writeRecords(results);
  console.log(`✔  Scraped ${results.length} companies`);
})();
