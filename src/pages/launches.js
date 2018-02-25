const Table  = require ('../parser/Table');
const colors = require('colors');

const parser = ($) => {
  const cores = [];

  $('h6').each((_, h6) => {
    const $title = $(h6);
    const match = $title.text().match(/B\d{4}/);

    if (match) {
      const info = (new Table($, $title.next())).headers;

      cores.push({
        name: match[0],
        vehicle: info[0],
        version: info[1],
        block: info[2].match(/block *(.+)/i)[1],
        flights: info[3].match(/(\d+) *flight/i)[1],
        status: info[4],
        story: $title.next().next().text(),
      });
    }
  });

  console.log(' Found ' + (cores.length + ' cores').green);

  return Promise.resolve(cores);
};

module.exports = parser;