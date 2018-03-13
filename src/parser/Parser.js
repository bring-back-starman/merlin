const fs = require('fs');
const colors = require('colors');
const path = require('path');
const fetch = require('../network/fetch');
const manifestParser = require('../pages/manifest');
const coresParser = require('../pages/cores');
const launchesParser = require('../pages/launches');

class Parser {
  async getManifest(fromMock = true) {
    return this.getJson('manifest', 'https://www.reddit.com/r/spacex/wiki/launches/manifest', manifestParser, fromMock);
  }

  async getCores(fromMock = true) {
    return this.getJson('cores', 'https://www.reddit.com/r/spacex/wiki/cores', coresParser, fromMock);
  }

  async getLaunches(fromMock = true) {
    return this.getJson('launches', 'https://www.reddit.com/r/spacex/wiki/launches', launchesParser, fromMock);
  }

  async getJson(name, url, parser, fromMock = true) {
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

module.exports = new Parser();