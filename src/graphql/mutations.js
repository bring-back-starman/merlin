const missionQuery = `mutation CreateMission($name: String!, $date: String!) {
  createMission(name: $name, date: $date) {
    id
  }
}`;

module.exports = {
  missionQuery,
};
