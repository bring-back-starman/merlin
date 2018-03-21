const colors = require('colors');
const parser = require('./parser/Parser');
const requests = require('./graphql/requests');
import missionMatcher from './matching/mission';

const fetchAll = async () => {
  const manifest = await parser.getManifest();
  const launches = await parser.getLaunches();

  let existingMissions = await requests.getMissions();

  for (let mission of launches) {
    const existingMission = missionMatcher(existingMissions, mission);
    const id = existingMission && existingMission.id || null;
    const { name, launchNumber, date, outcome, launchVideo, description, vehicle } = mission;

    if (existingMission && existingMission.name !== name) {
      console.log('Assuming same mission:', existingMission.name.yellow, '//', name.green);
    }

    await requests.createMission({
      id,
      name,
      launchNumber,
      date,
      outcome,
      launchVideo,
      description,
      vehicle,
    });
  }

  console.log('Created '  + (launches.length + '').yellow + ' missions');

  existingMissions = await requests.getMissions();

  for (let mission of manifest.upcoming) {
    if (!mission.payload) {
      continue;
    }

    const existingMission = missionMatcher(existingMissions, mission);

    const id = existingMission && existingMission.id || null;
    const { date, vehicle, orbit, payload } = mission;

    if (existingMission && existingMission.name !== payload) {
      console.log('Assuming same mission:', existingMission.name.yellow, '//', payload.green);
    }

    await requests.createMission({
      id,
      vehicle,
      orbit,
      date,
      name: payload
    });
  }

  console.log('Created '  + (manifest.upcoming.length + '').yellow + ' upcoming missions');

  existingMissions = await requests.getMissions();

  for (let mission of manifest.past) {
    const existingMission = missionMatcher(existingMissions, mission);

    const id = existingMission && existingMission.id || null;
    const { date, vehicle, orbit, payload } = mission;

    if (existingMission && existingMission.name !== payload) {
      console.log('Assuming same mission:', existingMission.name.yellow, '//', payload.green);
    }

    await requests.createMission({
      id,
      vehicle,
      orbit,
      date,
      name: payload
    });
  }

  console.log('Created '  + (manifest.upcoming.length + '').yellow + ' past missions');

  for (let orbit of manifest.orbits) {
    const { acronym, name, altitude_km, description } = orbit;

    await requests.createOrbit({
      acronym,
      name,
      altitudeKm: altitude_km,
      description,
    });
  }

  console.log('Created '  + (manifest.orbits.length + '').yellow + ' orbits');
};

fetchAll().catch(console.error);
