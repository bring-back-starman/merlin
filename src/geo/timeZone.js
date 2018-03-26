import fetch from '../network/fetch';
import fs from 'fs';
import path from 'path';

import config from '../config';

/**
 * @param {string} latLng e.g. 25.9972641,-97.1560845
 * @returns {string} time zone e.g. America/Chicago
 */
export async function getTimeZone(latLng) {
  const cacheLocation = path.join(__dirname, 'timeZone.cache.json');
  const cacheExists = fs.existsSync(cacheLocation);
  let cache = {};
  let timeZone = null;

  if (cacheExists) {
    cache = require('./timeZone.cache.json');
  }

  if (cache[latLng]) {
    timeZone = cache[latLng];
  } else {
    timeZone = (await fetch('https://maps.googleapis.com/maps/api/timezone/json?location=' + latLng + '&timestamp=1545482316&key=' + config.gmap.key)).timeZoneId;
  }

  cache[latLng] = timeZone;

  fs.writeFileSync(cacheLocation, JSON.stringify(cache, null, 2));

  return timeZone;
}