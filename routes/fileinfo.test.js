const setup = require('./__helpers__/setup');

const errors = require('../services/util/errors');
const licenseFactory = require('../__helpers__/licenseFactory');
const fileDataFactory = require('../__helpers__/fileDataFactory');

describe('fileinfo routes', () => {
  let context;

  const licenseStore = { all: jest.fn(), compatible: jest.fn() };
  const fileData = { getFileData: jest.fn() };
  const licenses = { getLicense: jest.fn() };
  const services = { licenseStore, fileData, licenses };

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

  describe('GET /fileinfo', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const wikiUrl = 'https://en.wikipedia.org';
    const mediaType = 'BITMAP';
    const mockFileData = fileDataFactory({ title, wikiUrl, mediaType });
    const license = licenseFactory({ id: 'cc-by-sa-4.0', name: 'CC BY-SA 4.0' });

    function options() {
      return { url: `/fileinfo/${title}`, method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    }

    it('returns the license of a file', async () => {
      fileData.getFileData.mockReturnValue(mockFileData);
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
