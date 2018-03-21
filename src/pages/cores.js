import { vehicleParser } from '../parser/helpers';

const Table  = require ('../parser/Table');
const colors = require('colors');

const parser = ($) => {
  const cores = [];

  $('h6').each((_, h6) => {
    const $title = $(h6);
    const match = $title.text().match(/B\d{4}/);

    if (match) {
      const [vehicle, version, block, flights, status] = (new Table($, $title.next())).headers;
      const [name] = match;

      cores.push({
        name,
        vehicle: vehicleParser(vehicle),
        version,
        block: parseInt(block.match(/block *(.+)/i)[1]),
        flights: parseInt(flights.match(/(\d+) *flight/i)[1]),
        status,
        description: $title.next().next().text(),
      });
    }
  });

  console.log(' Found ' + (cores.length + ' cores').green);

  return Promise.resolve(cores);
};

module.exports = parser;