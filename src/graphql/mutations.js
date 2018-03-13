const gql = require('graphql-tag');

const deleteMissions = gql`
    mutation {
        deleteMissions
    }
`;

const createMission = gql`
    mutation ($mission: NewMission!) {
        createMission(mission: $mission) {
            id
        }
    }
`;

const createOrbit = gql`
    mutation ($orbit: NewOrbit!) {
        createOrbit(orbit: $orbit) {
            acronym
        }
    }
`;

module.exports = {
  deleteMissions,
  createMission,
  createOrbit,
};
