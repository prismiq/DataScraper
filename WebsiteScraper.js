const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');
const url = require('url');

const baseUrl = '[WebsiteURL]'; //Set WebsiteURL
const visitedUrls = new Set(); //Set Existing Urls visited
const outputFilePath = 'websites.txt';

// Recursively scrape website links
function scrapeLinks(url) {
  if (visitedUrls.has(url)) {
    return;
  }
  console.log(`Scraping ${url}...`);
  visitedUrls.add(url);
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      const $ = cheerio.load(data);
      const links = $('a').map((i, el) => $(el).attr('href')).get();
      links.forEach((link) => {
        if (link.startsWith(baseUrl)) {
          scrapeLinks(link);
        }
      });
      writeUrlToFile(url);
    });
  }).on('error', (err) => {
    console.error(`Error scraping ${url}: ${err.message}`);
  });
}

// Write URL to file
function writeUrlToFile(url) {
  fs.appendFileSync(outputFilePath, url + '\n');
}

// Start scraping
scrapeLinks(baseUrl);
