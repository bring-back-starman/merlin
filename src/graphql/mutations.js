import gql from 'graphql-tag';

export const deleteMissions = gql`
    mutation {
        deleteMissions
    }
`;

export const createMission = gql`
    mutation ($mission: NewMission!) {
        createMission(mission: $mission) {
            id
        }
    }
`;

export const createOrbit = gql`
    mutation ($orbit: NewOrbit!) {
        createOrbit(orbit: $orbit) {
            acronym
        }
    }
`;
