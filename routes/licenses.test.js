const setup = require('./__helpers__/setup');

describe('license routes', () => {
  let context;

  const licenseStore = { all: jest.fn(), compatible: jest.fn() };
  const fileData = { getFileData: jest.fn() };
  const licenses = { getLicense: jest.fn() };
  const services = { licenseStore, fileData, licenses };
  const licensesMock = [
    {
      url: 'https://foo.bar/path with spaces',
      name: 'bar',
    },
    {
      url: 'https://foo.bar/just-a-regular-path',
      name: 'foo',
    },
  ];

  beforeEach(async () => {
    fileData.getFileData.mockReset();
    licenses.getLicense.mockReset();
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
    function options() {
      return { url: `/licenses/compatible/CC+BY-SA+3.0`, method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    }

    beforeEach(() => {
      licenseStore.compatible.mockReturnValue(licensesMock);
    });

    it('returns a list of licenses', async () => {
      const response = await subject();

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('calls service with decoded license parameter string', async () => {
      await subject();

      expect(licenseStore.compatible).toHaveBeenCalledWith('CC BY-SA 3.0');
    });
  });

  describe('GET /license', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const wikiUrl = 'https://en.wikipedia.org';
    const license = {
      id: 'cc-by-sa-3.0',
      name: 'CC BY-SA 3.0',
      url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
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
        throw new Error('empty-response');
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
        throw new Error('invalid-url');
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
  });
});
