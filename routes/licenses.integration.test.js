const setup = require('./__helpers__/setup');

const LicenseStore = require('../services/licenseStore');
const licenseData = require('../config/licenses/licenses');
const portReferences = require('../config/licenses/portReferences');

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
      response.payload.forEach(license => {
        const keys = Object.keys(license);
        expect(keys).toEqual(expect.arrayContaining(licenseKeys));
        licenseKeys.forEach(key => {
          expect(license[key]).toBeDefined();
        });
      });
    });
  });

  describe('GET /licenses/compatible/{licenseId}', () => {
    const defaults = {
      licenseId: 'cc-by-sa-3.0-de',
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
      expect(licenses.map(license => license.code)).toEqual(
        expect.arrayContaining(expectedLicenses)
      );

      licenses.forEach(license => {
        const keys = Object.keys(license);
        expect(keys).toEqual(expect.arrayContaining(licenseKeys));
        licenseKeys.forEach(key => {
          expect(license[key]).toBeDefined();
        });
      });
    });

    it('returns a proper error for invalid license ids', async () => {
      const response = await subject({ licenseId: 'flerb-florb' });

      expect(response.status).toBe(404);
      expect(response.type).toBe('application/json');

      expect(response.status).toBe(404);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchObject({
        error: 'Not Found',
        message: 'license-not-found',
        statusCode: 404,
      });
    });
  });
});
