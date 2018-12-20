const Files = require('./files');

const WikiClient = require('./wikiClient');
const parse = require('./parseWikiUrl');

const imageTitles = require('./__fixtures__/imageTitles');
const imagesInfo = require('./__fixtures__/imagesInfo');

jest.mock('./wikiClient');
jest.mock('./parseWikiUrl');

describe('Files', () => {
  const wikiClient = { getResultsFromApi: jest.fn() };

  describe('getPageImages()', () => {
    const url = 'https://en.wikipedia.org/wiki/Article_Title';
    const title = 'Article_Title';
    const wikiUrl = 'https://en.wikipedia.org';

    beforeEach(() => {
      WikiClient.mockImplementation(() => wikiClient);
      parse.mockImplementation(() => ({ title, wikiUrl }));
    });

    it('parses the url and retrieves all images for the article', async () => {
      wikiClient.getResultsFromApi
        .mockResolvedValueOnce(imageTitles)
        .mockResolvedValueOnce(imagesInfo);

      const service = new Files();
      const files = await service.getPageImages(url);

      expect(parse).toHaveBeenCalledWith(url);
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
