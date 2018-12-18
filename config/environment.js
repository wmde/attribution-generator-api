// Load application config
const logging = require('./logging');
// const secret = require('./secret');
const server = require('./server');
const services = require('./services');
const swagger = require('./swagger');

module.exports = {
  logging,
  // secret,
  server,
  services,
  swagger,
};
