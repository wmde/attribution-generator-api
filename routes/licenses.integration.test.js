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

  beforeEach(async () => {
    context = await setup({ services });
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /licenses', () => {
    const licenseKeys = ['code', 'name', 'url', 'groups'];
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
});
