const setup = require('./__helpers__/setup');

describe('license routes', () => {
  let context;

  const licenseStore = { all: jest.fn(), compatible: jest.fn() };
  const fileData = { getFileData: jest.fn() };
  const licenses = { getLicense: jest.fn() };
  const services = { licenseStore, fileData, licenses };

  beforeEach(async () => {
    context = await setup({ services });
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /licenses', () => {
    const licensesResponse = [
      {
        url: 'https://foo.bar/path with spaces',
        name: 'bar',
      },
      {
        url: 'https://foo.bar/just-a-regular-path',
        name: 'foo',
      },
    ];

    function options() {
      return { url: `/licenses`, method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    }

    beforeEach(() => {
      licenseStore.all.mockReturnValue(licensesResponse);
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
      licenseStore.compatible.mockReturnValue(licenses);
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

    describe('when the license can be retrieved', () => {
      beforeEach(() => {
        fileData.getFileData.mockReturnValue({ title, wikiUrl });
        licenses.getLicense.mockReturnValue(license);
      });

      it('returns the license of a file', async () => {
        const response = await subject({});

        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(response.payload).toMatchSnapshot();
      });
    });

    describe('when there is a problem retrieving the file data', () => {
      beforeEach(() => {
        fileData.getFileData.mockImplementation(() => {
          throw new Error('notFound');
        });
      });

      it('returns a 404', async () => {
        const response = await subject({});

        expect(response.status).toBe(404);
        expect(response.type).toBe('application/json');
      });
    });
  });
});
