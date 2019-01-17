const AttributionGenerator = require('./attributionGenerator');
const Attribution = require('../models/attribution');

jest.genMockFromModule('../models/attribution');
jest.mock('../models/attribution');

describe('AttributionGenerator', () => {
  const license = { id: 'some-license-id', url: 'some-license-url' };
  const attributionHtml = 'some-html-string';
  const attributionPlain = 'some-plain-text-string';

  const attributionModelMock = {
    html: jest.fn(),
    plainText: jest.fn(),
    license,
  };

  const attributionInfoMock = {
    licenseId: license.id,
    licenseUrl: license.url,
    attributionHtml,
    attributionPlain,
  };

  beforeEach(() => {
    attributionModelMock.html.mockImplementation(() => attributionHtml);
    attributionModelMock.plainText.mockImplementation(() => attributionPlain);

    Attribution.mockImplementation(() => attributionModelMock);
  });

  describe('generateAttribution', () => {
    it('generates a new attribution and returns its core information', () => {
      const params = {};
      const service = new AttributionGenerator();

      const attributionInfo = service.generateAttribution(params);
      expect(attributionInfo).toEqual(attributionInfoMock);
    });
  });
});
