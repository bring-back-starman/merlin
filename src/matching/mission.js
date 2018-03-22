import map from 'lodash/fp/map';
import maxBy from 'lodash/fp/maxBy';
import { dateRatio, launchNumberRatio, missionNumberRatio, nameRatio, vehicleRatio } from './ratios';

export default (missions, mission) => {
  const scored = map(m => ({ score: getScore(m, mission), mission: m }), missions);
  let closest = maxBy('score', scored);

  return closest && closest.score && closest.mission || null;
};

function getScore(m1, m2) {
  let nameR = nameRatio(m1, m2);
  return vehicleRatio(m1, m2) * dateRatio(m1, m2) * launchNumberRatio(m1, m2) * missionNumberRatio(m1, m2) * (nameR > .7 ? nameR : 0);
}



