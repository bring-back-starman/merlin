const path = require('path');

const env = process.env.NODE_ENV || 'development';

require('dotenv-safe').load({
  path: path.join(__dirname, `../.env.${env}`),
  sample: path.join(__dirname, '../.env.example'),
});

module.exports = {
  env,
  jwt: {
    token: process.env.JWT_TOKEN
  },
  graphql: {
    uri: process.env.GRAPHQL_URL
  }
};
