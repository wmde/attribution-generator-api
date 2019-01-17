const setup = require('./__helpers__/setup');

describe('attribution routes', () => {
  const attributionMock = {
    license: 'CC BY-SA 3.0',
    attribution_plain: 'fake plain text attribution',
    attribution_html: 'fake html attribution',
    license_url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
  };
  const services = {
    fileData: { getFileData: jest.fn() },
    licenses: { getLicense: jest.fn() },
    attributionGenerator: { generateAttribution: jest.fn(() => attributionMock) },
  };
  const fileInfoMock = {
    title: 'File:Apple_Lisa2-IMG_1517.jpg',
    rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Apple_Lisa2-IMG_1517.jpg',
    wikiUrl: 'https://commons.wikimedia.org/',
    artistHtml:
      '<a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a> &amp; Musée Bolo',
  };
  const licenseMock = {
    code: 'CC BY-SA 3.0',
    url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
  };

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
      services.licenses.getLicense.mockResolvedValue(licenseMock);
      services.attributionGenerator.generateAttribution.mockReturnValue(attributionMock);
    });

    afterEach(() => {
      services.fileData.getFileData.mockReset();
      services.licenses.getLicense.mockReset();
      services.attributionGenerator.generateAttribution.mockReset();
    });

    it('returns attribution information for the given file', async () => {
      const response = await subject({});
      const isEdited = false;
      const { rawUrl: fileUrl, title: fileTitle } = fileInfoMock;

      expect(services.fileData.getFileData).toHaveBeenCalledWith(file);
      expect(services.licenses.getLicense).toHaveBeenCalledWith(fileInfoMock);
      expect(services.attributionGenerator.generateAttribution).toHaveBeenCalledWith({
        license: licenseMock,
        languageCode,
        typeOfUse,
        isEdited,
        fileInfo: fileInfoMock,
      });

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });
  });
});
