const setup = require('./__helpers__/setup');
const licenseFactory = require('../__helpers__/licenseFactory');

describe('attribution routes', () => {
  const services = {
    fileData: { getFileData: jest.fn() },
    licenses: { getLicense: jest.fn() },
  };
  const fileInfoMock = {
    title: 'File:Apple_Lisa2-IMG_1517.jpg',
    rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Apple_Lisa2-IMG_1517.jpg',
    wikiUrl: 'https://commons.wikimedia.org/',
    artistHtml:
      '<a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a> &amp; Musée Bolo',
    attributionHtml:
      'Photograph by <a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a>, Wikimedia Commons, Cc-by-sa-2.0-fr',
  };
  const license = licenseFactory({
    id: 'cc-by-sa-2.5',
    name: 'CC BY-SA 2.5',
    groups: ['cc', 'cc2.5', 'ccby'],
    url: 'https://creativecommons.org/licenses/by-sa/2.5/legalcode',
  });

  let context;

  beforeEach(async () => {
    context = await setup({ services });
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /attribution/... (unmodified)', () => {
    const file = 'File:Foobar.jpg';
    const languageCode = 'en';
    const typeOfUse = 'online';

    const defaults = {
      languageCode,
      file,
      typeOfUse,
    };

    function options(overrides = {}) {
      const params = { ...defaults, ...overrides };
      const url = `/attribution/${params.languageCode}/${params.file}/${
        params.typeOfUse
      }/unmodified`;
      return { method: 'GET', url };
    }

    async function subject(overrides = {}) {
      return context.inject(options(overrides));
    }

    beforeEach(() => {
      services.fileData.getFileData.mockResolvedValue(fileInfoMock);
      services.licenses.getLicense.mockResolvedValue(license);
    });

    afterEach(() => {
      services.fileData.getFileData.mockReset();
      services.licenses.getLicense.mockReset();
    });

    it('returns attribution information for the given file', async () => {
      const response = await subject();

      expect(services.fileData.getFileData).toHaveBeenCalledWith(file);
      expect(services.licenses.getLicense).toHaveBeenCalledWith(fileInfoMock);

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns 500 for any generic error', async () => {
      services.fileData.getFileData.mockImplementation(() => {
        throw new Error('some error');
      });
      const response = await subject();

      expect(services.fileData.getFileData).toHaveBeenCalledWith(file);
      expect(services.licenses.getLicense).not.toHaveBeenCalled();
      expect(response.status).toBe(500);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns an error when the file responds with a license we do not know', async () => {
      services.licenses.getLicense.mockImplementation(() => undefined);
      const response = await subject();

      expect(services.fileData.getFileData).toHaveBeenCalledWith(file);
      expect(services.licenses.getLicense).toHaveBeenCalledWith(fileInfoMock);
      expect(response.status).toBe(422);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });
  });
});
