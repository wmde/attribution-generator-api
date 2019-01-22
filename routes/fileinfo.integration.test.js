const setup = require('./__helpers__/setup');

const LicenseStore = require('../services/licenseStore');
const Client = require('../services/util/client');
const FileData = require('../services/fileData');
const Licenses = require('../services/licenses');

const licenseData = require('../config/licenses/licenses');
const portReferences = require('../config/licenses/portReferences');

describe('fileinfo routes', () => {
  beforeAll(() => {
    startRecording('routes/fileinfo');
  });

  afterAll(async () => {
    await stopRecording();
  });

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
      return { url: `/fileinfo/${title}`, method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    }

    it('returns the license of a file', async () => {
      const response = await subject({});

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchObject({
        license: {
          code: 'cc-by-sa-2.0-ported',
          name: 'CC BY-SA 2.0 FR',
          url: 'https://creativecommons.org/licenses/by-sa/2.0/fr/deed.en',
          groups: ['cc', 'cc2', 'ported', 'knownPorted'],
        },
        author_html:
          '<a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a> &amp; Musée Bolo',
        attribution_html:
          'Photograph by <a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a>, Wikimedia Commons, Cc-by-sa-2.0-fr',
        media_type: 'BITMAP',
      });
    });
  });
});
