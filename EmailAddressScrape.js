const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');

// Regular expression for email matching
const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

// Read the list of websites from a file
const websites = fs.readFileSync('websites.txt', 'utf8').split('\n');

// Function to scrape email addresses from a website
function scrapeWebsite(website) {
  console.log(`Scraping ${website}...`);
  https.get(website, (res) => {
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
}

// Iterate through each website and scrape email addresses
websites.forEach(scrapeWebsite);
