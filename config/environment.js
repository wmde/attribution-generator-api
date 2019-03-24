// Load application config
const logging = require('./logging');
// const secret = require('./secret');
const server = require('./server');
const services = require('./services');
const swagger = require('./swagger');
const tracker = require('./tracker');

module.exports = {
  logging,
  // secret,
  server,
  services,
  swagger,
  tracker,
};
