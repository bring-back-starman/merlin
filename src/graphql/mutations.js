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

module.exports = {
  deleteMissions,
  createMission,
};
