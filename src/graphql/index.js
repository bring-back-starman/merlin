import { createApolloFetch } from 'apollo-fetch';

import config from '../config';
import { createMission, createOrbit, createPad } from './mutations';
import { getMissions, getPads } from './queries';

const apolloFetch = createApolloFetch({ uri: config.graphql.uri });

apolloFetch.use(({ request, options }, next) => {
  if (!options.headers) {
    options.headers = {};
  }
  options.headers['authorization'] = 'Bearer ' + config.graphql.token;

  next();
});

export default {
  createMission: (mission) => apolloFetch({ query: createMission, variables: { mission } }),
  createOrbit: (orbit) => apolloFetch({ query: createOrbit, variables: { orbit } }),
  getMissions: () => apolloFetch({ query: getMissions }).then(reponse => reponse.data.missions),
  getPads: () => apolloFetch({ query: getPads }).then(reponse => reponse.data.pads),
  createPad: (pad) => apolloFetch({ query: createPad, variables: { pad } }),
};
