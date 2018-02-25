const fetch = require('./network/fetch');
const Table  = require ('./parser/Table');
const colors = require('colors');

fetch('https://www.reddit.com/r/spacex/wiki/launches/manifest', ($) => {

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

  console.log(' Found ' + (table.data.length + ' missions').green);
  console.log(table.toObjects());
});