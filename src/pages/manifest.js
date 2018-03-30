import colors from 'colors';
import DateRange from 'date-range';
import requests from '../graphql';
import padMatcher from '../matching/pad';

import Table from './utils/Table';
import { vehicleParser, altitudeParser, yesNoParser } from './utils/helpers';

const parseUpcoming = ($, getPad) => {
  const upcomingTable = new Table($, $('#wiki_upcoming_falcon_launches').next());
  upcomingTable.setHeaders(['date', 'vehicle', 'padShortName', 'orbitShortName', 'payloadMass', 'payload', 'customer', 'notes']);
  upcomingTable.addTextMapper('date', (data) => new DateRange(data));
  upcomingTable.addTextMapper('vehicle', vehicleParser);
  upcomingTable.addNullMapper('orbitShortName', '?');
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

  let upcoming = upcomingTable.toObjects();

  upcoming = upcoming.map(launch => {
    const pad = getPad(launch.padShortName);

    launch.padShortName = pad.shortName || pad.name;
    launch.date.setTimeZone('UTC');

    return launch;
  });

  console.log(' Found ' + (upcoming.length + ' upcoming missions').green);

  return upcoming;
};

const parsePast = ($, getPad) => {
  const pastTable = new Table($, $('#wiki_past_launches').next().next());
  pastTable.setHeaders(['date', 'vehicle', 'core', 'padShortName', 'orbitShortName', 'payloadMass', 'payload', 'customer', 'outcome', 'landing']);
  pastTable.addTextMapper('date', (data) => new DateRange(data));
  pastTable.addTextMapper('vehicle', vehicleParser);
  pastTable.addNullMapper('payloadMass', '?');
  pastTable.addTextMapper('core', (text) => text.match(/b\d{4}/ig));

  let past = pastTable.toObjects();

  past = past.map(launch => {
    const pad = getPad(launch.padShortName);

    launch.padShortName = pad.shortName || pad.name;
    launch.date.setTimeZone('UTC');

    return launch;
  });

  console.log(' Found ' + (past.length + ' past missions').green);

  return past;
};

const parseOrbits = ($) => {
  const orbitTable = new Table($, $('[id^="wiki_orbits_"]').next().next());
  orbitTable.setHeaders(['shortName', 'name', 'altitudeKm', 'inclinationDeg', 'launchCapability', 'description']);
  orbitTable.addNullMapper('inclinationDeg', 'N/A');
  orbitTable.addTextMapper('altitudeKm', altitudeParser);
  orbitTable.addTextMapper('launchCapability', yesNoParser);

  const orbits = orbitTable.toObjects();
  console.log(' Found ' + (orbits.length + ' orbits').green);

  return orbits;
};

export default async ($) => {
  const existingPads = await requests.getPads();
  const getPad = (pad) => padMatcher(existingPads, pad);

  return Promise.resolve({
    upcoming: parseUpcoming($, getPad),
    past: parsePast($, getPad),
    orbits: parseOrbits($),
  });
};