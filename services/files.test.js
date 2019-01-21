const Files = require('./files');

const parseWikiUrl = require('./util/parseWikiUrl');
const errors = require('./util/errors');

const imageTitles = require('./__fixtures__/imageTitles');
const imageTitlesMissing = require('./__fixtures__/imageTitlesMissing');
const imagesInfo = require('./__fixtures__/imagesInfo');

jest.mock('./util/parseWikiUrl');

describe('Files', () => {
  const client = { getResultsFromApi: jest.fn() };

  describe('getPageImages()', () => {
    const url = 'https://en.wikipedia.org/wiki/Article_Title';
    const title = 'Article_Title';
    const wikiUrl = 'https://en.wikipedia.org';

    it('passes on the error if the url cannot be parsed', async () => {
      parseWikiUrl.mockImplementation(() => {
        throw new Error(errors.invalidUrl);
      });
      const service = new Files({ client });
      await expect(service.getPageImages(url)).rejects.toThrow(errors.invalidUrl);
    });

    describe('with a valid wikipedia url', () => {
      beforeEach(() => parseWikiUrl.mockReturnValue({ title, wikiUrl }));

      it('returns a list of all images from the given article', async () => {
        client.getResultsFromApi
          .mockResolvedValueOnce(imageTitles)
          .mockResolvedValueOnce(imagesInfo);

        const service = new Files({ client });
        const files = await service.getPageImages(url);

        expect(client.getResultsFromApi).toHaveBeenCalledWith([title], 'images', wikiUrl, { imlimit: 500 });
        expect(client.getResultsFromApi).toHaveBeenCalledWith(
          ['File:Graphic 01.jpg', 'File:logo.svg'],
          'imageinfo',
          wikiUrl,
          { iiprop: 'url|size', iiurlwidth: 300 }
        );
        expect(files).toMatchSnapshot();
      });

      it('returns an empty array if no images can be found', async () => {
        client.getResultsFromApi.mockResolvedValueOnce(imageTitlesMissing);

        const service = new Files({ client });
        const files = await service.getPageImages(url);

        expect(client.getResultsFromApi).toHaveBeenCalledWith([title], 'images', wikiUrl, { imlimit: 500 });
        expect(files).toEqual([]);
      });

      it('returns an empty array if no image url can be found', async () => {
        client.getResultsFromApi
          .mockResolvedValueOnce(imageTitles)
          .mockResolvedValueOnce({ pages: {} });

        const service = new Files({ client });
        const files = await service.getPageImages(url);

        expect(client.getResultsFromApi).toHaveBeenCalledWith([title], 'images', wikiUrl, { imlimit: 500 });
        expect(client.getResultsFromApi).toHaveBeenCalledWith(
          ['File:Graphic 01.jpg', 'File:logo.svg'],
          'imageinfo',
          wikiUrl,
          { iiprop: 'url|size', iiurlwidth: 300 }
        );
        expect(files).toEqual([]);
      });
    });
  });
});
