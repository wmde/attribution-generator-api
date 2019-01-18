const setup = require('./__helpers__/setup');

const LicenseStore = require('../services/licenseStore');
const Client = require('../services/util/client');
const FileData = require('../services/fileData');
const Licenses = require('../services/licenses');

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
  const services = { licenseStore, fileData, licenses };

  beforeEach(async () => {
    context = await setup({ services });
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /attribution/... (unmodified)', () => {
    const defaults = {
      languageCode: 'en',
      file: 'File:Foobar.jpg',
      typeOfUse: 'online',
    };

    function options(overrides = {}) {
      const { languageCode, file, typeOfUse } = { ...defaults, ...overrides };
      const url = `/attribution/${languageCode}/${file}/${typeOfUse}/unmodified`;
      return { url, method: 'GET' };
    }

    async function subject(overrides) {
      return context.inject(options(overrides));
    }

    it('returns the attribution', async () => {
      const response = await subject({});

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns a proper error for unknown typeOfUse', async () => {
      const response = await subject({ typeOfUse: 'does-not-exist' });

      expect(response.status).toBe(400);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchObject({
        error: 'Bad Request',
        message: 'Invalid request params input',
        statusCode: 400,
      });
    });

    it('returns a proper error for weird file urls', async () => {
      const response = await subject({ file: 'does-not-exist' });

      expect(response.status).toBe(422);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchObject({
        error: 'Unprocessable Entity',
        message: 'invalid-url',
        statusCode: 422,
      });
    });
  });
});
