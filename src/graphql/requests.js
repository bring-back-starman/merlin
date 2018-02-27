const request = require('request');

const config = require('../config');
const { getQueryBody } = require('./utils');
const { missionQuery } = require('./mutations');

const persistMission = (mission) => {
  const { jwt, graphql } = config;
  const { payload, date } = mission;

  request({
    uri: `${graphql.uri}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt.token}`,
      'Content-Type': 'application/json',
    },
    body: getQueryBody({
      query: missionQuery,
      variables: {
        name: `${payload} mission`,
        date,
      },
    }),
  });
};

module.exports = {
  persistMission,
};
