const Table  = require ('../parser/Table');
const colors = require('colors');

// fetch('').then(($) => {
const parser = ($) => {

  let $table = $('#wiki_upcoming_falcon_launches').next();
  const table = new Table($, $table);
  table.setHeaders(['date', 'vehicle', 'launch_site', 'orbit', 'payload_mass', 'payload', 'customer', 'notes']);
  table.addNullMapper('date', 'TBA');
  table.addNullMapper('orbit', '?');
  table.addNullMapper('payload_mass', '?');
  table.addNullMapper('payload', '?');
  table.addMapper('notes', (data) => {
    const text = data.text();
    const refs = data.find('a').toArray().map(a => a.attribs.href);

    return {
      official: text.includes('O'),
      source: text.includes('S'),
      manned: text.includes('M'),
      reuse: text.includes('R'),
      test: text.includes('T'),
      refs: refs,
    }
  });

  let data = table.toObjects();
  console.log(' Found ' + (data.length + ' missions').green);

  return Promise.resolve(data);
};

module.exports = parser;