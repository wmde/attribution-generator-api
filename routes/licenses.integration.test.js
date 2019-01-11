const setup = require('./__helpers__/setup');

const LicenseStore = require('../services/licenseStore');
const Client = require('../services/util/client');
const FileData = require('../services/fileData');
const Licenses = require('../services/licenses');

const licenseData = require('../config/licenses/licenses');
const portReferences = require('../config/licenses/portReferences');

// NOTE: this is a tmp integration test to easify development
// we probably do not want to run this by default in the future
// (only on CI maybe)
describe('license routes', () => {
  let context;

  const client = new Client();
  const licenseStore = new LicenseStore(licenseData, portReferences);

  const fileData = new FileData({ client });
  const licenses = new Licenses({ client, licenseStore });
  const services = { licenseStore, fileData, licenses };

  beforeEach(async () => {
    context = await setup({ services });
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /license', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';

    function options() {
      return { url: `/license/${title}`, method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    }

    it('returns the license of a file', async () => {
      const response = await subject({});

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchObject({
        code: 'CC BY-SA 2.0 FR',
        url: 'https://creativecommons.org/licenses/by-sa/2.0/fr/deed.en',
      });
    });
  });
});
