const request = require('request');
const colors = require('colors');
const cheerio = require('cheerio');

const fetch = (url, cb) => {
  console.log('fetching '.yellow + url);
  request(url, (error, response, body) => {
    if (!response || response.statusCode !== 200 || error) {
      console.log(' Could not load data'.red);
      console.log(' Error:', error);
      console.log(' Status code:', response && response.statusCode);

      return;
    }

    console.log(' 200 OK'.green);

    cb(cheerio.load(body));
  });
};

module.exports = fetch;