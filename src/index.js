const fetch = require('./network/fetch');
const colors = require('colors');
const manifestParser = require('./pages/manifest');
const coresParser = require('./pages/cores');

const fetchAll = async () => {
  const manifest = await fetch('https://www.reddit.com/r/spacex/wiki/launches/manifest').then(manifestParser);
  const cores = await fetch('https://www.reddit.com/r/spacex/wiki/cores').then(coresParser);
};

fetchAll();