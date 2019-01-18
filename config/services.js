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

module.exports = services;
