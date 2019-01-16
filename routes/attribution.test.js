const setup = require('./__helpers__/setup');
const path = require('path');

describe('attribution routes', () => {
  const services = {
    fileData: { getFileData: jest.fn() },
    licenses: { getLicense: jest.fn() },
    attributionGenerator: { generateAttribution: jest.fn(() => attributionMock) },
  };
  const fileInfoMock = {
    title: 'File:Apple_Lisa2-IMG_1517.jpg',
    rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Apple_Lisa2-IMG_1517.jpg',
    wikiUrl: 'https://commons.wikimedia.org/',
    artistHtml: '<a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a> &amp; Musée Bolo'
  };
  const licenseMock = {
    code: 'CC BY-SA 3.0',
    url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
  };
  const attributionMock = {
    license: 'CC BY-SA 3.0',
    attribution_plain: 'Pierre Dalous (https://commons.wikimedia.org/wiki/File:Pair_of_Merops_apiaster_feeding.jpg), "Pair of Merops apiaster feeding", https://creativecommons.org/licenses/by-sa/3.0/legalcode',
    attribution_text: 'Pierre Dalous (https://commons.wikimedia.org/wiki/File:Pair_of_Merops_apiaster_feeding.jpg), "Pair of Merops apiaster feeding", https://creativecommons.org/licenses/by-sa/3.0/legalcode',
    attribution_html: 'Pierre Dalous (https://commons.wikimedia.org/wiki/File:Pair_of_Merops_apiaster_feeding.jpg), "Pair of Merops apiaster feeding", https://creativecommons.org/licenses/by-sa/3.0/legalcode',
    license_url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
  };

  let context;

  beforeEach(async () => {
    context = await setup({ services });
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /attribution/... (unmodified)', () => {
    const defaults = {
      language: 'en',
      file: 'File:Foobar.jpg',
      typeOfUse: 'online',
    };

    function options(overrides = {}) {
      const params = { ...defaults, ...overrides };
      const url = `/attribution/${params.language}/${params.file}/${params.typeOfUse}/unmodified`;
      return { method: 'GET', url };
    }

    async function subject(overrides = {}) {
      return context.inject(options(overrides));
    }

    beforeEach(() => {
      services.fileData.getFileData.mockResolvedValue(fileInfoMock);
      services.licenses.getLicense.mockResolvedValue(licenseMock);
      services.attributionGenerator.generateAttribution.mockResolvedValue(attributionMock);
    });

    afterEach(() => {
      services.fileData.getFileData.mockReset();
      services.licenses.getLicense.mockReset();
      services.attributionGenerator.generateAttribution.mockReset();
    });

    it('returns an attribution for the given file', async () => {
      const response = await subject({});

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('calls services', async () => {
      const response = await subject({});
      const expectedParams = {
        language: 'en',
        license: {
          code: 'CC BY-SA 3.0',
          url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode'
        },
        typeOfUse: 'online'
      };

      expect(services.licenseService.fetchLicense).toHaveBeenCalledWith(defaults.file);
      expect(services.attributionGenerator.generateAttribution).toHaveBeenCalledWith(expectedParams);
    });
  });
});
