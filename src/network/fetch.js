import request from 'request';
import colors from 'colors';
import cheerio from 'cheerio';

export default (url) => {
  console.log('fetching '.yellow + url);

  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (!response || response.statusCode !== 200 || error) {
        console.log(' Could not load data'.red);
        console.log(' Status code:', response && response.statusCode);
        console.log(' Error:', error);

        return reject(error);
      }

      console.log(' 200 OK'.green);

      resolve(cheerio.load(body));
    });
  });
};