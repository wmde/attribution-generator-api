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
      languageCode: 'en',
      file: 'File:Foobar.jpg',
      typeOfUse: 'online',
    };

    const attribution =
      {
        licenseId: 'cc-zero',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode',
        attributionHtml: '<a href="https://commons.wikimedia.org/wiki/User:Kaldari">Kaldari</a>, <a href="https://upload.wikimedia.org/wikipedia/commons/3/3a/Foobar.jpg">Foobar</a>, <a href="https://creativecommons.org/publicdomain/zero/1.0/legalcode" rel="license">CC0 1.0</a>',
        attributionPlain: 'Kaldari (https://upload.wikimedia.org/wikipedia/commons/3/3a/Foobar.jpg), „Foobar“, https://creativecommons.org/publicdomain/zero/1.0/legalcode'
      };


    function options(overrides = {}) {
      const params = { ...defaults, ...overrides };
      const url = `/attribution/${params.languageCode}/${params.file}/${params.typeOfUse}/unmodified`;
      return { url, method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    }

    it('returns the attribution', async () => {
      const response = await subject({});

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchObject(attribution);
    });
  });
});
