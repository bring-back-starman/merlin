import gql from 'graphql-tag';

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
            shortName
        }
    }
`;

export const createPad = gql`
    mutation ($pad: NewPad!) {
        createPad(pad: $pad) {
            shortName
        }
    }
`;
