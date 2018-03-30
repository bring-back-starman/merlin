import colors from 'colors';
import DateRange from 'date-range';
import partition from 'lodash/fp/partition';
import zip from 'lodash/fp/zip';
import get from 'lodash/fp/get';
import some from 'lodash/fp/some';

import { vehicleParser } from './utils/helpers';
import Table from './utils/Table';

export default ($) => {
  const cores = [];

  $('h6').each((_, h6) => {
    const $title = $(h6);
    const match = $title.text().match(/B\d{4}/);

    if (match) {
      const [vehicle, version, block, flights, status] = (new Table($, $title.next())).headers;
      const [name] = match;

      let $description = $title.next().next();
      let missions = [];

      if ($description.next().text() === 'Missions') {
        const missionsTable = new Table($, $description.next().next());
        missionsTable.setHeaders(['number', 'date', 'mission', 'name', 'landing', 'outcome']);
        missionsTable.addTextMapper('date', (data) => data && new DateRange(data) || null);
        missionsTable.addMapper('landing', (data) => {
          const $a = data.find('a');

          if (!$a.length) {
            if (data.text() && !['---', 'N/A', 'No', 'Unknown', 'TBD'].includes(data.text()) && !data.text().match(/^\[.+]$/)) {
              return {
                site: data.text(),
              };
            }

            return data.text() === 'No' ? false : null;
          }

          if (['#red', '#green'].includes($a.attr('href'))) {
            return {
              site: $a.text(),
              success: $a.attr('href') === '#green',
            }
          }

          return {
            url: $a.attr('href'),
            type: $a.text().toLowerCase().includes('photo') ? 'photo' : 'video',
          };
        });

        missionsTable.addMapper('mission', (data) => {
          const $a = data.find('a');

          if (!$a.length) {
            return data.text() === '---' || data.text().match(/^\[.+]$/) ? null : data.text();
          }

          return $a.attr('href');
        });

        missionsTable.addMapper('name', (data) => {
          const $a = data.find('a');

          if (!$a.length) {
            return data.text().match(/^\[.+]$/) || data.text() === 'Unknown' ? null : data.text();
          }

          return $a.attr('href');
        });

        missionsTable.addMapper('outcome', (data) => {
          const $a = data.find('a');

          if (!$a.length) {
            return null;
          }

          if (['#red', '#green'].includes($a.attr('href'))) {
            return data.text();
          }

          return $a.attr('href');
        });

        missions = missionsTable.toObjects().filter(data => some(d => d, data));

        missions = zip(...partition(row => row.number, missions)).map(([m, l]) => {
          let landing = {
            site: get('landing.site', m),
            success: get('landing.success', m),
            media: get('landing.url', l),
          };

          if (!some(d => d, landing)) {
            landing = null;
          }

          if (m.landing === false) {
            landing = false;
          }

          let missionNumber = null;
          let missionNumberMatch;

          if (missionNumberMatch = m.mission.match(/F[9H]-(\d+)/)) {
            missionNumber = missionNumberMatch[1];
          }

          if (missionNumberMatch = m.mission.match(/F(?:alcon )?9 Mission (\d+)/i)) {
            missionNumber = missionNumberMatch[1];
          }

          return {
            name: m.name,
            date: m.date,
            missionNumber,
            outcome: m.outcome,
            landing,
            campaignThread: get('mission', l),
            launchThread: get('name', l),
            webcast: get('outcome', l),
          };
        });
      }

      cores.push({
        name,
        vehicle: vehicleParser(vehicle),
        version,
        block: parseInt(block.match(/block *(.+)/i)[1]),
        flights: parseInt(flights.match(/(\d+) *flight/i)[1]),
        status,
        description: $description.text(),
        missions,
      });
    }
  });

  console.log(' Found ' + (cores.length + ' cores').green);

  return Promise.resolve(cores);
};