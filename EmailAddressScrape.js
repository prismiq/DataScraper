const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');

const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

// Read the list of websites from a file
const websites = fs.readFileSync('websites.txt').toString().split('\n');

// Scrape email addresses from each page of each website
websites.forEach((website) => {
  console.log(`Scraping ${website}...`);
  https.get(`${website}`, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      const $ = cheerio.load(data);
      const emailAddresses = $('body').text().match(emailRegex);
      if (emailAddresses) {
        console.log(`Email addresses found on ${website}:`);
        console.log(emailAddresses);
      } else {
        console.log(`No email addresses found on ${website}`);
      }
    });
  }).on('error', (err) => {
    console.error(`Error scraping ${website}: ${err.message}`);
  });
});
