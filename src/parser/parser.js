import fs from 'fs';
import colors from 'colors';
import path from 'path';

import fetch from '../network/fetch';
import manifestParser from '../pages/manifest';
import coresParser from '../pages/cores';
import launchesParser from '../pages/launches';
import padsParser from '../pages/pads';

class Parser {
  getManifest(fromMock = false) {
    return this.getJson('manifest', 'https://www.reddit.com/r/spacex/wiki/launches/manifest', manifestParser, fromMock);
  }

  getCores(fromMock = false) {
    return this.getJson('cores', 'https://www.reddit.com/r/spacex/wiki/cores', coresParser, fromMock);
  }

  getLaunches(fromMock = false) {
    return this.getJson('launches', 'https://www.reddit.com/r/spacex/wiki/launches', launchesParser, fromMock);
  }

  getPads(fromMock = false) {
    return this.getJson('pads', 'https://www.reddit.com/r/SpaceX/wiki/pads', padsParser, fromMock);
  }

  async getJson(name, url, parser, fromMock = false) {
    const mockLocation = path.join(__dirname, '../mocks/', name + '.json');
    const mockExists = fs.existsSync(mockLocation);

    if (mockExists && fromMock) {
      console.log('Getting ' + name.yellow + ' from previous run.');

      return require('../mocks/' + name + '.json');
    }

    console.log('Getting ' + name.yellow + ' from the web.');

    const json = await fetch(url).then(parser);
    fs.writeFileSync(mockLocation, JSON.stringify(json, null, 2));

    return json;
  }
}

export default new Parser();