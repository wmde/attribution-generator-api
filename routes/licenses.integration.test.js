const setup = require('./__helpers__/setup');

const LicenseStore = require('../services/licenseStore');
const licenseData = require('../config/licenses/licenses');
const portReferences = require('../config/licenses/portReferences');

// NOTE: this is a temporary integration test to easify development
// We probably do not always want to run this as part of the normal test suite
// since this is hitting actual Wikipedia and Wikimedia APIs.
// We could consider running it only on CI or introduce a JS-equivalent to VCR
describe('licenses routes', () => {
  let context;

  const licenseStore = new LicenseStore(licenseData, portReferences);
  const services = { licenseStore };

  const licenseKeys = ['code', 'name', 'url', 'groups'];

  beforeEach(async () => {
    context = await setup({ services });
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /licenses', () => {
    function options() {
      return { url: `/licenses`, method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    }

    it('returns the list of licenses', async () => {
      const response = await subject({});

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      response.payload.forEach((license) => {
        const keys = Object.keys(license);
        expect(keys).toEqual(expect.arrayContaining(licenseKeys));
        licenseKeys.forEach((key) => {
          expect(license[key]).toBeDefined();
        });
      });
    });
  });

  describe('GET /licenses/compatible/{licenseId}', () => {
    const defaults = {
      licenseId: 'cc-by-sa-3.0-de'
    };

    const expectedLicenses = ['cc-by-sa-3.0', 'cc-by-sa-4.0'];

    function options(overrides) {
      const { licenseId } = { ...defaults, ...overrides };
      return { url: `/licenses/compatible/${licenseId}`, method: 'GET' };
    }

    async function subject(overrides = {}) {
      return context.inject(options(overrides));
    }

    it('returns the list of compatible licenses', async () => {
      const response = await subject();

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');

      const licenses = response.payload;
      expect(licenses.map(license => license.code)).toEqual(expect.arrayContaining(expectedLicenses));

      licenses.forEach((license) => {
        const keys = Object.keys(license);
        expect(keys).toEqual(expect.arrayContaining(licenseKeys));
        licenseKeys.forEach((key) => {
          expect(license[key]).toBeDefined();
        });
      });
    });

    it('returns a proper error for invalid license ids', async () => {
      const response = await subject({ licenseId: 'flerb-florb' });

      expect(response.status).toBe(422);
      expect(response.type).toBe('application/json');

      expect(response.payload).toMatchObject({
        error: 'Unprocessable Entity',
        message: 'invalid-license',
        data: 'flerb-florb',
        statusCode: 422,
      });
    });
  });
});
