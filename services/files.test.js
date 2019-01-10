const Files = require('./files');

const parse = require('./parseWikiUrl');

const imageTitles = require('./__fixtures__/imageTitles');
const imagesInfo = require('./__fixtures__/imagesInfo');

jest.mock('./parseWikiUrl');

describe('Files', () => {
  const client = { getResultsFromApi: jest.fn() };

  describe('getPageImages()', () => {
    const url = 'https://en.wikipedia.org/wiki/Article_Title';
    const title = 'Article_Title';
    const wikiUrl = 'https://en.wikipedia.org';

    beforeEach(() => parse.mockImplementation(() => ({ title, wikiUrl })));

    it('parses the url and retrieves all images for the article', async () => {
      client.getResultsFromApi.mockResolvedValueOnce(imageTitles).mockResolvedValueOnce(imagesInfo);

      const service = new Files({ client });
      const files = await service.getPageImages(url);

      expect(parse).toHaveBeenCalledWith(url);
      expect(client.getResultsFromApi).toHaveBeenCalledWith(title, 'images', wikiUrl);
      expect(client.getResultsFromApi).toHaveBeenCalledWith(
        'File:Graphic 01.jpg|File:logo.svg',
        'imageinfo',
        wikiUrl,
        { iiprop: 'url' }
      );

      expect(files).toMatchSnapshot();
    });
  });
});
