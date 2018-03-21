import DateRange from 'date-range';
import sum from 'lodash/fp/sum';
import moment from 'moment';
import { containsSlices } from './helpers';

/**
 * Return .5 if either one is missing, 1 if they are identical, and 0 otherwise.
 * @param attr name of the attribute
 * @param {object} mission1
 * @param {object} mission2
 * @returns {number}
 */
const exactSame = (attr, mission1, mission2) => {
  if (!mission1[attr] || !mission2[attr]) {
    return .5;
  }

  return mission1[attr] === mission2[attr] ? 1 : 0;
};

const cleanMissionName = (name) => {
  if (!name) {
    return null;
  }

  name = name.trim();
  name = name.replace(/ +/g, ' '); // replace multiple spaces by only one
  name = name.replace(/ ?- ?/g, '-'); // remove spaces around dashes

  return name;
};

/**
 * Parse an Iridium payload name and extracts the flight number, number of satellites, and satellites numbers
 */
export const iridiumData = (value) => {
  if (!value.match(/iridium/i)) {
    return null;
  }

  let flight = value.match(/(?:iridium|flight|mission) (\d+)/i);
  flight = flight && parseInt(flight[1]);

  let satellites = value.match(/(\d+) (?:sats|satellites)/i);
  satellites = satellites && parseInt(satellites[1]);

  let range = value.match(/(\d+) *- *(\d+)/);
  range = range && [parseInt(range[1]), parseInt(range[2])];

  // Number of satellites of each iridium launches until launch 8
  const flights = [10, 10, 10, 10, 10, 5, 10, 10];

  // If we have flight number we force the range just in case
  if (flight && flight <= flights.length) {
    const last = sum(flights.slice(0, flight));
    range = [last - flights[flight - 1] + 1, last];
  }

  // If we have the range we can compute the flight number
  if (!flight && range) {
    let f = 1;

    while (range[1] > sum(flights.slice(0, f)) && f <= flights.length) {
      f++;
    }

    if (f <= flights.length) {
      flight = f;
    }
  }

  // If we have the range we can compute the number of satellites
  if (!satellites && range) {
    satellites = range[1] - range[0] + 1;
  }

  return { flight, satellites, range };
};

export function vehicleRatio(m1, m2) {
  return exactSame('vehicle', m1, m2);
}

export function launchNumberRatio(m1, m2) {
  return exactSame('launchNumber', m1, m2);
}

export function missionNumberRatio(m1, m2) {
  return exactSame('missionNumber', m1, m2);
}

/**
 * @param {number} valueOnOverlap
 * @param {number} defaultValue
 * @param {number} numberOfDaysForTransition
 * @param {number} overlap
 * @returns {number} valueOnOverlap if overlap > 0, defaultValue if -overlap > numberOfDaysForTransition, interpolate in between
 */
const interpolateOverlap = (valueOnOverlap, defaultValue, numberOfDaysForTransition, overlap) => {
  return Math.max(defaultValue, valueOnOverlap * (Math.min(0, overlap) / numberOfDaysForTransition + 1));
};

export function dateRatio(m1, m2) {
  if (!m1.date || !m2.date) {
    return .5;
  }

  const d1 = new DateRange(m1.date);
  const d2 = new DateRange(m2.date);

  if (d1.type === DateRange.Type.TBA && d2.type === DateRange.Type.TBA) {
    return 1;
  }

  if (d1.type === DateRange.Type.TBA || d2.type === DateRange.Type.TBA) {
    return .7;
  }

  const past1 = moment(d1.from).diff(moment()) < 0;
  const past2 = moment(d2.from).diff(moment()) < 0;

  // If one of the date is in the past, dates have to match
  if (past1 || past2) {
    return moment(d1.from).format('L') === moment(d2.from).format('L') ? 1 : 0;
  }

  const overlap = d1.getOverlapDuration(d2).asDays();
  const duration1 = d1.getDuration().asDays();
  const duration2 = d2.getDuration().asDays();
  const bigger = duration1 > duration2 ? d1 : d2;

  // Both ranges are not the same type
  if (d1.type !== d2.type) {
    const [valueOnOverlap, numberOfDaysForTransition] = {
      [DateRange.Type.DATE]:    [1.0, 1],
      [DateRange.Type.MONTH]:   [.95, 7],
      [DateRange.Type.QUARTER]: [.90, 30],
      [DateRange.Type.HALF]:    [.85, 60],
      [DateRange.Type.YEAR]:    [.80, 90],
    }[bigger.type];

    return interpolateOverlap(valueOnOverlap, .1, numberOfDaysForTransition, overlap);
  }
  // Both ranges are the same type
  else {
    const diff = moment.duration(moment(d1.from).diff(d2.from));

    const [valueOfDiff, zeroAfterXUnits] = {
      [DateRange.Type.DATETIME]: [diff.asHours(), 48],
      [DateRange.Type.DATE]:     [diff.asDays(), 7],
      [DateRange.Type.MONTH]:    [diff.asMonths(), 3],
      [DateRange.Type.QUARTER]:  [diff.asMonths(), 4.5],
      [DateRange.Type.HALF]:     [diff.asMonths(), 9],
      [DateRange.Type.YEAR]:     [diff.asYears(), 1.5],
    }[d1.type];

    return Math.max(.1, -Math.abs(valueOfDiff) / zeroAfterXUnits  + 1);
  }
}

export function nameRatio(m1, m2) {
  const name1 = cleanMissionName(m1.name || m1.payload);
  const name2 = cleanMissionName(m2.name || m2.payload);

  if (!name1 || !name2) {
    return .3;
  }

  // Easy
  if (name1.replace('-', ' ').toLowerCase() === name2.replace('-', ' ').toLowerCase()) {
    return 1;
  }

  let parts1;
  let parts2;

  // Acronyms
  parts1 = name1.match(/^([A-Z]+)$/);
  parts2 = name2.match(/^([A-Z]+)$/);

  if (parts1 || parts2) {
    let [acronym, other] = parts1 ? [name1, name2] : [name2, name1];
    other = other.replace(/ *[&] */g, ' ').replace(/(?<=\w)[\w ]/g, '').toUpperCase();

    if(other === acronym) {
      return 1;
    }
  }

  // Iridium
  parts1 = iridiumData(name1);
  parts2 = iridiumData(name2);

  if (parts1 || parts2) {
    if (!parts1 || !parts2) {
      return 0;
    }

    if (parts1.flight && parts2.flight) {
      return parts1.flight === parts2.flight ? 1 : 0;
    }

    if (parts1.range && parts2.range) {
      return parts1.range[0] === parts2.range[0] && parts1.range[1] === parts2.range[1] ? 1 : 0;
    }

    if (parts1.satellites && parts2.satellites && parts1.satellites !== parts2.satellites) {
      return 0;
    }
  }

  // Match parts
  const equivalence = [
    ['SpaceX', 'SpX'],
    ['GPS 3', 'GPS IIIA'],
    ['CCtCap Demo Mission', 'Crew Dragon Demo'],
    ['Starlink', 'Microsat-2a, Microsat-2b', 'Microsat-2a,-2b'],
  ];

  parts1 = name1;
  parts2 = name2;

  equivalence.forEach(eq => {
    eq.slice(1).forEach(replace => {
      parts1 = parts1.replace(replace, eq[0]);
      parts2 = parts2.replace(replace, eq[0]);
    });
  });

  parts1 = parts1.replace(/[ &+()/-]+/g, ' ').toLowerCase().trim().split(' ');
  parts2 = parts2.replace(/[ &+()/-]+/g, ' ').toLowerCase().trim().split(' ');

  const [smaller, bigger] = parts1.length < parts2.length ? [parts1, parts2] : [parts2, parts1];
  return containsSlices(bigger, smaller);
}