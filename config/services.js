const assert = require('assert');

const LicenseStore = require('../services/licenseStore');
const Client = require('../services/util/client');
const Files = require('../services/files');
const FileData = require('../services/fileData');
const Licenses = require('../services/licenses');

const licenses = require('./licenses/licenses');
const portReferences = require('./licenses/portReferences');

// Read service configurations from environment.
const config = JSON.parse(process.env.SERVICES);

assert.ok(typeof config === 'object', 'Invalid services configuration provided');

// Create configured service instances.
const client = new Client();
const licenseStore = new LicenseStore(licenses, portReferences);

const services = {
  licenseStore,
  files: new Files({ client }),
  fileData: new FileData({ client }),
  licenses: new Licenses({ client, licenseStore }),
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
