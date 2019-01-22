const setup = require('./__helpers__/setup');

const licenseFactory = require('../__helpers__/licenseFactory');

describe('license routes', () => {
  let context;

  const licenseStore = { all: jest.fn(), compatible: jest.fn() };
  const fileData = { getFileData: jest.fn() };
  const licenses = { getLicense: jest.fn() };
  const services = { licenseStore, fileData, licenses };
  const licensesMock = [
    licenseFactory({ id: 'cc-by-sa-4.0', name: 'CC BY-SA 4.0' }),
    licenseFactory({ id: 'cc-by-sa-3.0', name: 'CC BY-SA 3.0' }),
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
});
