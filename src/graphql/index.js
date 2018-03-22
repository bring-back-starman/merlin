import { createApolloFetch } from 'apollo-fetch';

import config from '../config';
import { deleteMissions, createMission, createOrbit } from './mutations';
import { getMissions } from './queries';

const apolloFetch = createApolloFetch({ uri: config.graphql.uri });

apolloFetch.use(({ request, options }, next) => {
  if (!options.headers) {
    options.headers = {};
  }
  options.headers['authorization'] = 'Bearer ' + config.graphql.token;

  next();
});

export default {
  deleteMissions: () => apolloFetch({ query: deleteMissions }),
  createMission: (mission) => apolloFetch({ query: createMission, variables: { mission } }),
  createOrbit: (orbit) => apolloFetch({ query: createOrbit, variables: { orbit } }),
  getMissions: () => apolloFetch({ query: getMissions }).then(reponse => reponse.data.missions),
};
