import colors from 'colors';
import DateRange from 'date-range';

import Table from './utils/Table';
import { vehicleParser, altitudeParser, yesNoParser } from './utils/helpers';

const parseUpcoming = ($) => {
  const upcomingTable = new Table($, $('#wiki_upcoming_falcon_launches').next());
  upcomingTable.setHeaders(['date', 'vehicle', 'launchSite', 'orbit', 'payloadMass', 'payload', 'customer', 'notes']);
  upcomingTable.addTextMapper('date', (data) => new DateRange(data));
  upcomingTable.addTextMapper('vehicle', vehicleParser);
  upcomingTable.addNullMapper('orbit', '?');
  upcomingTable.addNullMapper('payloadMass', '?');
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

  return upcoming;
};

const parsePast = ($) => {
  const pastTable = new Table($, $('#wiki_past_launches').next().next());
  pastTable.setHeaders(['date', 'vehicle', 'core', 'launchSite', 'orbit', 'payloadMass', 'payload', 'customer', 'outcome', 'landing']);
  pastTable.addTextMapper('date', (data) => new DateRange(data));
  pastTable.addTextMapper('vehicle', vehicleParser);
  pastTable.addNullMapper('payloadMass', '?');
  pastTable.addTextMapper('core', (text) => text.match(/b\d{4}/ig));

  const past = pastTable.toObjects();
  console.log(' Found ' + (past.length + ' past missions').green);

  return past;
};

const parseOrbits = ($) => {
  const orbitTable = new Table($, $('[id^="wiki_orbits_"]').next().next());
  orbitTable.setHeaders(['acronym', 'name', 'altitudeKm', 'inclinationDeg', 'launchCapability', 'description']);
  orbitTable.addNullMapper('inclinationDeg', 'N/A');
  orbitTable.addTextMapper('altitudeKm', altitudeParser);
  orbitTable.addTextMapper('launchCapability', yesNoParser);

  const orbits = orbitTable.toObjects();
  console.log(' Found ' + (orbits.length + ' orbits').green);

  return orbits;
};

export default ($) => {
  return Promise.resolve({
    upcoming: parseUpcoming($),
    past: parsePast($),
    orbits: parseOrbits($),
  });
};