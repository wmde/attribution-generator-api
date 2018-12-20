const Files = require('./files');

const WikiClient = require('./wikiClient');
const WikiUrlParser = require('./wikiUrlParser');

const imageTitles = require('./__fixtures__/imageTitles');
const imagesInfo = require('./__fixtures__/imagesInfo');

jest.mock('./wikiClient');
jest.mock('./wikiUrlParser');

describe('Files', () => {
  const wikiClient = { getResultsFromApi: jest.fn() };
  const wikiUrlParser = { parse: jest.fn() };

  beforeEach(() => {
    WikiUrlParser.mockImplementation(() => wikiUrlParser);
    WikiClient.mockImplementation(() => wikiClient);
  });

  describe('getPageImages()', () => {
    const url = 'https://en.wikipedia.org/wiki/Article_Title';
    const title = 'Article_Title';
    const wikiUrl = 'https://en.wikipedia.org';

    it('parses the url and retrieves all images for the article', async () => {
      wikiUrlParser.parse.mockResolvedValue({ title, wikiUrl });
      wikiClient.getResultsFromApi
        .mockResolvedValueOnce(imageTitles)
        .mockResolvedValueOnce(imagesInfo);

      const service = new Files();
      const files = await service.getPageImages(url);

      expect(wikiUrlParser.parse).toHaveBeenCalledWith(url);
      expect(wikiClient.getResultsFromApi).toHaveBeenCalledWith(title, 'images', wikiUrl);
      expect(wikiClient.getResultsFromApi).toHaveBeenCalledWith(
        'File:Graphic 01.jpg|File:logo.svg',
        'imageinfo',
        wikiUrl,
        { iiprop: 'url' }
      );

      expect(files).toMatchSnapshot();
    });
  });
});
