const { createApolloFetch } = require('apollo-fetch');

const config = require('../config');
const { deleteMissions, createMission } = require('./mutations');

const apolloFetch = createApolloFetch({ uri: config.graphql.uri });

apolloFetch.use(({ request, options }, next) => {
  if (!options.headers) {
    options.headers = {};
  }
  options.headers['authorization'] = 'Bearer ' + config.graphql.token;

  next();
});

module.exports = {
  deleteMissions: () => apolloFetch({ query: deleteMissions }),
  createMission: (mission) => apolloFetch({ query: createMission, variables: { mission } }),
};
