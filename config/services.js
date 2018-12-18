const assert = require('assert');

const LicenseStore = require('../services/license-store');

const unported = require('./licenses/unported');
const ported = require('./licenses/ported');

// Read service configurations from environment.
const config = JSON.parse(process.env.SERVICES);

assert.ok(typeof config === 'object', 'Invalid services configuration provided');

// Create configured service instances.
const services = {
  licenses: new LicenseStore(unported, ported),
};

// const services = Object.keys(registry).reduce((all, name) => {
//   const Service = registry[name]
//   const options = config[name]
//
//   assert.ok(typeof Service === 'function', `Did not find a valid service constructor for "${name}" service`)
//   assert.ok(typeof options === 'object', `Invalid "options" option provided for "${name}" service`)
//
//   const service = new Service(options)
//
//   return { ...all, [name]: service }
// }, {})

module.exports = services;
