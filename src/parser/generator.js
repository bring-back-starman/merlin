import colors from 'colors';
import get from 'lodash/fp/get';

import parser from './parser';
import requests from '../graphql';
import missionMatcher from '../matching/mission';
import padMatcher from '../matching/pad';

class Generator {
  async missionsFromRedditLaunches(fromMock = false) {
    const launches = await parser.getLaunches(fromMock);
    const existingMissions = await requests.getMissions();

    for (let mission of launches) {
      const existingMission = missionMatcher(existingMissions, mission);
      const id = existingMission && existingMission.id || null;
      const { name, launchNumber, date, outcome, launchVideo, description, vehicle } = mission;

      if (existingMission && existingMission.name !== name) {
        console.log('Assuming same mission:', existingMission.name.yellow, '//', name.green);
      }

      await requests.createMission({
        id,
        name: existingMission && existingMission.name.length > name.length ? existingMission.name : name,
        launchNumber,
        date,
        outcome,
        launchVideo,
        description,
        vehicle,
      });
    }

    console.log('Created '  + (launches.length + '').yellow + ' missions');
  }

  async missionsFromRedditUpcomingLaunchesManifest(fromMock = false) {
    const manifest = await parser.getManifest(fromMock);
    const existingMissions = await requests.getMissions();

    for (let mission of manifest.upcoming) {
      if (!mission.payload) {
        continue;
      }

      const existingMission = missionMatcher(existingMissions, mission);
      const id = existingMission && existingMission.id || null;
      const { date, vehicle, orbit, payload, pad } = mission;

      if (existingMission && existingMission.name !== payload) {
        console.log('Assuming same mission:', existingMission.name.yellow, '//', payload.green);
      }

      await requests.createMission({
        id,
        vehicle,
        orbit,
        date,
        pad,
        name: existingMission && existingMission.name.length > payload.length ? existingMission.name : payload,
      });
    }

    console.log('Created '  + (manifest.upcoming.length + '').yellow + ' upcoming missions');
  }

  async missionsFromRedditPastLaunchesManifest(fromMock = false) {
    const manifest = await parser.getManifest(fromMock);
    const existingMissions = await requests.getMissions();

    for (let mission of manifest.past) {
      const existingMission = missionMatcher(existingMissions, mission);
      const id = existingMission && existingMission.id || null;
      const { date, vehicle, orbit, payload, pad } = mission;

      if (existingMission && existingMission.name !== payload) {
        console.log('Assuming same mission:', existingMission.name.yellow, '//', payload.green);
      }

      await requests.createMission({
        id,
        vehicle,
        orbit,
        date,
        pad,
        name: existingMission && existingMission.name.length > payload.length ? existingMission.name : payload,
      });
    }

    console.log('Created '  + (manifest.upcoming.length + '').yellow + ' past missions');
  }

  async orbitsFromRedditLaunchesManifest(fromMock = false) {
    const manifest = await parser.getManifest(fromMock);

    for (let orbit of manifest.orbits) {
      const { acronym, name, altitudeKm, description } = orbit;

      await requests.createOrbit({
        acronym,
        name,
        altitudeKm,
        description,
      });
    }

    console.log('Created '  + (manifest.orbits.length + '').yellow + ' orbits');
  }

  async padsFromRedditPads(fromMock = false) {
    const existingPads = await requests.getPads();
    const pads = await parser.getPads(fromMock);

    for (let pad of pads) {
      const existingMission = padMatcher(existingPads, pad);
      const id = get('id', existingMission);
      await requests.createPad({ id, ...pad });
    }

    console.log('Created '  + (pads.length + '').yellow + ' pads');
  }
}

export default new Generator();