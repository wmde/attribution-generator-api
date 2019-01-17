const setup = require('./__helpers__/setup');

const errors = require('../services/util/errors');

describe('license routes', () => {
  let context;

  const licenseStore = { all: jest.fn(), compatible: jest.fn() };
  const fileData = { getFileData: jest.fn() };
  const licenses = { getLicense: jest.fn() };
  const services = { licenseStore, fileData, licenses };
  const licensesMock = [
    {
      id: 'cc-by-sa-4.0',
      name: 'CC BY-SA 4.0',
      groups: ['cc', 'cc4'],
      compatibility: [],
      regexp: /^(Bild-)?CC-BY-SA(-|\/)4.0(([^-]+.+|-migrated)*)?$/i,
      url: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode',
    },
    {
      id: 'cc-by-sa-3.0',
      name: 'CC BY-SA 3.0',
      groups: ['cc', 'cc4'],
      compatibility: [],
      regexp: /^(Bild-)?CC-BY-SA(-|\/)4.0(([^-]+.+|-migrated)*)?$/i,
      url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
    },
  ];

  beforeEach(async () => {
    fileData.getFileData.mockReset();
    licenses.getLicense.mockReset();
    licenseStore.all.mockReset();
    licenseStore.compatible.mockReset();
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

    beforeEach(() => {
      licenseStore.all.mockReturnValue(licensesMock);
    });

    it('returns a list of licenses', async () => {
      const response = await subject({});

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });
  });

  describe('GET /licenses/compatible/{license}', () => {
    const licenseId = 'cc-by-sa-3.0-de';
    function options() {
      return { url: `/licenses/compatible/${licenseId}`, method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    }

    it('returns a list of licenses', async () => {
      licenseStore.compatible.mockReturnValue(licensesMock);
      const response = await subject();

      expect(licenseStore.compatible).toHaveBeenCalledWith(licenseId);
      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns an empty response if no compatible licences could be found', async () => {
      licenseStore.compatible.mockReturnValue([]);
      const response = await subject();

      expect(licenseStore.compatible).toHaveBeenCalledWith(licenseId);
      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });
  });

  describe('GET /license', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const wikiUrl = 'https://en.wikipedia.org';
    const license = {
      id: 'cc-by-sa-4.0',
      name: 'CC BY-SA 4.0',
      groups: ['cc', 'cc4'],
      compatibility: [],
      regexp: /^(Bild-)?CC-BY-SA(-|\/)4.0(([^-]+.+|-migrated)*)?$/i,
      url: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode',
    };

    function options() {
      return { url: `/license/${title}`, method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    }

    it('returns the license of a file', async () => {
      fileData.getFileData.mockReturnValue({ title, wikiUrl });
      licenses.getLicense.mockReturnValue(license);

      const response = await subject({});

      expect(fileData.getFileData).toHaveBeenCalledWith(title);
      expect(licenses.getLicense).toHaveBeenCalledWith({ title, wikiUrl });
      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns a 404 response when the license cannot be retrieved', async () => {
      fileData.getFileData.mockImplementation(() => {
        throw new Error(errors.emptyResponse);
      });

      const response = await subject({});

      expect(fileData.getFileData).toHaveBeenCalledWith(title);
      expect(licenses.getLicense).not.toHaveBeenCalled();
      expect(response.status).toBe(404);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns a 422 response when the identifier cannot be parsed', async () => {
      fileData.getFileData.mockImplementation(() => {
        throw new Error(errors.invalidUrl);
      });

      const response = await subject({});

      expect(fileData.getFileData).toHaveBeenCalledWith(title);
      expect(licenses.getLicense).not.toHaveBeenCalled();
      expect(response.status).toBe(422);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns a 500 response for any generic error', async () => {
      fileData.getFileData.mockImplementation(() => {
        throw new Error('some error');
      });

      const response = await subject({});

      expect(fileData.getFileData).toHaveBeenCalledWith(title);
      expect(licenses.getLicense).not.toHaveBeenCalled();
      expect(response.status).toBe(500);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns a 503 response when the wiki api is not reachable', async () => {
      fileData.getFileData.mockImplementation(() => {
        throw new Error(errors.apiUnavailabe);
      });

      const response = await subject({});

      expect(fileData.getFileData).toHaveBeenCalledWith(title);
      expect(licenses.getLicense).not.toHaveBeenCalled();
      expect(response.status).toBe(503);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });
  });
});
