const gql = require('graphql-tag');

const getMissions = gql`
    {
        missions(limit: 1000, type: ALL) {
            id
            name
            vehicle
            launchNumber
            missionNumber
            date {
                from
                to
                type
            }
        }
    }
`;

module.exports = {
  getMissions,
};
