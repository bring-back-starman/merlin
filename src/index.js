const colors = require('colors');
const parser = require('./parser/Parser');
const requests = require('./graphql/requests');

const fetchAll = async () => {
  const manifest = await parser.getManifest();
  const launches = await parser.getLaunches();

  console.log('Nuking missions database'.red);
  await requests.deleteMissions();

  launches.forEach(({ name, flight, date, status, youtube, story }) => {
    requests.createMission({
      name,
      launchNumber: flight,
      date,
      missionOutcome: status,
      launchVideo: youtube,
      description: story,
    })
  });

  console.log('Created '  + (launches.length + '').yellow + ' missions');

  manifest.orbits.forEach(({ acronym, name, altitude_km, description }) => {
    requests.createOrbit({
      acronym,
      name,
      altitudeKm: altitude_km,
      description,
    })
  });

  console.log('Created '  + (manifest.orbits.length + '').yellow + ' orbits');
};

fetchAll().catch(console.error);
