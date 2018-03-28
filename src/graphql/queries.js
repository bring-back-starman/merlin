import gql from 'graphql-tag';

export const getMissions = gql`
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

export const getPads = gql`
    {
        pads {
            name
            shortName
            base
            state
            timeZone
        }
    }
`;
