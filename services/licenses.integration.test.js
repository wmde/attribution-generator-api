const Licenses = require('./licenses');

const Client = require('./util/client');
const LicenseStore = require('./licenseStore');

const licenses = require('../config/licenses/licenses');
const portReferences = require('../config/licenses/portReferences');

// NOTE: this is a tmp integration test to easify development
// we probably do not want to run this by default in the future
// (only on CI maybe)
describe('getLicenseForFile', () => {
  const client = new Client();
  const licenseStore = new LicenseStore(licenses, portReferences);
  const service = new Licenses({ client, licenseStore });

  it('returns the lisence for the uploaded file on commons', async () => {
    const url = 'https://en.wikipedia.org/wiki/Apple_Lisa#/media/File:Apple_Lisa.jpg';
    const response = await service.getLicense(url);
    expect(response).toMatchObject({ id: 'cc-by-sa-3.0', name: 'CC BY-SA 3.0' });
  });
});
