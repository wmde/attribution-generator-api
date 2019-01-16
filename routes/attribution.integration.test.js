const setup = require('./__helpers__/setup');

const LicenseStore = require('../services/licenseStore');
const Client = require('../services/util/client');
const FileData = require('../services/fileData');
const Licenses = require('../services/licenses');
const AttributionGenerator = require('../services/attributionGenerator');

const licenseData = require('../config/licenses/licenses');
const portReferences = require('../config/licenses/portReferences');

// NOTE: this is a temporary integration test to easify development
// We probably do not always want to run this as part of the normal test suite
// since this is hitting actual Wikipedia and Wikimedia APIs.
// We could consider running it only on CI or introduce a JS-equivalent to VCR
describe('attribution routes', () => {
  let context;

  const client = new Client();
  const licenseStore = new LicenseStore(licenseData, portReferences);

  const fileData = new FileData({ client });
  const licenses = new Licenses({ client, licenseStore });
  const attributionGenerator = new AttributionGenerator();
  const services = { licenseStore, fileData, licenses, attributionGenerator };

  beforeEach(async () => {
    context = await setup({ services });
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /attribution/... (unmodified)', () => {
    const defaults = {
      language: 'en',
      file: 'File:Foobar.jpg',
      typeOfUse: 'online',
    };

    function options(overrides = {}) {
      const params = { ...defaults, ...overrides };
      const url = `/attribution/${params.language}/${params.file}/${params.typeOfUse}/unmodified`;
      return { url, method: 'GET' };
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
