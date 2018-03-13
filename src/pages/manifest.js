const Table  = require ('../parser/Table');
const colors = require('colors');
const DateRange = require('date-range');

const parser = ($) => {
  const upcomingTable = new Table($, $('#wiki_upcoming_falcon_launches').next());
  upcomingTable.setHeaders(['date', 'vehicle', 'launch_site', 'orbit', 'payload_mass', 'payload', 'customer', 'notes']);
  upcomingTable.addTextMapper('date', (data) => new DateRange(data));
  upcomingTable.addTextMapper('vehicle', (vehicle) => vehicle.replace(/ *♺/g, ''));
  upcomingTable.addNullMapper('orbit', '?');
  upcomingTable.addNullMapper('payload_mass', '?');
  upcomingTable.addNullMapper('payload', '?');
  upcomingTable.addMapper('notes', (data) => {
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

  const upcoming = upcomingTable.toObjects();
  console.log(' Found ' + (upcoming.length + ' upcoming missions').green);


  const pastTable = new Table($, $('#wiki_past_launches').next().next());
  pastTable.setHeaders(['date', 'vehicle', 'core', 'launch_site', 'orbit', 'payload_mass', 'payload', 'customer', 'outcome', 'landing']);
  pastTable.addTextMapper('date', (data) => new DateRange(data));
  pastTable.addTextMapper('vehicle', (vehicle) => vehicle.replace(/ *v\d\.\d/, ''));
  pastTable.addNullMapper('payload_mass', '?');
  pastTable.addTextMapper('core', (text) => text.match(/b\d{4}/ig));

  const past = pastTable.toObjects();
  console.log(' Found ' + (past.length + ' past missions').green);

  return Promise.resolve({
    upcoming,
    past
  });
};

module.exports = parser;