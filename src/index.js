const colors = require('colors');
const parser = require('./parser/Parser');
const requests = require('./graphql/requests');

const fetchAll = async () => {
  const launches = await parser.getLaunches();

  console.log('Nuking database'.red);
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
};

fetchAll().catch(console.error);
