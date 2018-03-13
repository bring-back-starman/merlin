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

  const orbitTable = new Table($, $('[id^="wiki_orbits_"]').next().next());
  orbitTable.setHeaders(['acronym', 'name', 'altitude_km', 'inclination_deg', 'launch_capability', 'description']);
  orbitTable.addNullMapper('inclination_deg', 'N/A');
  orbitTable.addTextMapper('altitude_km', (altitude) => {
    if (altitude === 'N/A') {
      return null;
    }

    altitude = altitude.replace(/[^0-9>-]/g, '');

    if (altitude.match(/^\d+$/)) {
      return { min: parseInt(altitude), max: parseInt(altitude) };
    }

    if (altitude.match(/^\d+-\d+$/)) {
      const [min, max] = altitude.split('-').map(a => parseInt(a));
      return { min, max };
    }

    if (altitude.match(/^>\d+$/)) {
      return { min: parseInt(altitude.substr(1)), max: null };
    }
  });
  orbitTable.addTextMapper('launch_capability', (capability) => capability === 'Yes' && true || capability === 'No' && false || null);

  const orbits = orbitTable.toObjects();
  console.log(' Found ' + (orbits.length + ' orbits').green);

  return Promise.resolve({
    upcoming,
    past,
    orbits,
  });
};

module.exports = parser;