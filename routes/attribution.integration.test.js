const setup = require('./__helpers__/setup');

const LicenseStore = require('../services/licenseStore');
const Client = require('../services/util/client');
const FileData = require('../services/fileData');
const Licenses = require('../services/licenses');

const licenseData = require('../config/licenses/licenses');
const portReferences = require('../config/licenses/portReferences');

describe('attribution routes', () => {
  beforeAll(() => {
    startRecording('routes/attribution');
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

  describe('GET /attribution/... (modified)', () => {
    const defaults = {
      languageCode: 'en',
      file: 'File:Foobar.jpg',
      typeOfUse: 'online',
      modification: 'cropped',
      creator: 'the great modificator',
      licenseId: 'cc-zero',
    };

    const attribution = {
      licenseId: 'cc-zero',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode',
      attributionHtml:
        '<a href="https://commons.wikimedia.org/wiki/User:Kaldari">Kaldari</a>, <a href="https://upload.wikimedia.org/wikipedia/commons/3/3a/Foobar.jpg">Foobar</a>, cropped by the great modificator, <a href="https://creativecommons.org/publicdomain/zero/1.0/legalcode" rel="license">CC0 1.0</a>',
      attributionPlain:
        'Kaldari (https://upload.wikimedia.org/wikipedia/commons/3/3a/Foobar.jpg), „Foobar“, cropped by the great modificator, https://creativecommons.org/publicdomain/zero/1.0/legalcode',
    };

    function options(overrides = {}) {
      const params = { ...defaults, ...overrides };
      const url = `/attribution/${params.languageCode}/${params.file}/${
        params.typeOfUse
      }/modified/${params.modification}/${params.creator}/${params.licenseId}`;
      return { url, method: 'GET' };
    }

    async function subject(overrides) {
      return context.inject(options(overrides));
    }

    it('returns the attribution', async () => {
      const response = await subject({});

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchObject(attribution);
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

    it('returns a proper error for an unknown licenseId', async () => {
      const response = await subject({ licenseId: 'does-not-exist' });

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
