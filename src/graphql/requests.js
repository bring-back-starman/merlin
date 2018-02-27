const request = require('request');
const { getQueryBody } = require('./utils');
const { missionQuery } = require('./mutations');

const persistMission = (mission) => {
  const { payload, date } = mission;

  request({
    uri: `${process.env.GRAPHQL_URL}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.JWT_TOKEN}`,
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
