const getQueryBody = ({ query, variables }) => JSON.stringify({
  query,
  variables,
});

module.exports = {
  getQueryBody,
};
