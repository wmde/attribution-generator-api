const FetchOriginalFileData = require('./fetchOriginalFileData');

const WikiClient = require('./wikiClient');
const parse = require('./parseWikiUrl');

const imageInfoMock = require('./__fixtures__/imageInfo');

jest.mock('./wikiClient');
jest.mock('./parseWikiUrl');

describe('FetchOriginalFileData', () => {
  const wikiClient = { getResultsFromApi: jest.fn() };

  describe('getFileData', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const wikiUrl = 'https://en.wikipedia.org';

    describe('when all all data is available', () => {
      const originalWikiUrl = 'https://commons.wikimedia.org/';
      const artistHtml =
        '<a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a> &amp; Musée Bolo';

      beforeEach(() => {
        WikiClient.mockImplementation(() => wikiClient);
        parse.mockImplementationOnce(() => ({ title, wikiUrl: originalWikiUrl }));

        wikiClient.getResultsFromApi.mockResolvedValueOnce(imageInfoMock);
      });

      it('retrieves the original wikiUrl, title and artistHtml information', async () => {
        const service = new FetchOriginalFileData();
        const imageInfo = await service.getFileData({ title, wikiUrl });

        expect(wikiClient.getResultsFromApi).toHaveBeenCalledWith(title, 'imageinfo', wikiUrl, {
          iiprop: 'url|extmetadata',
          iilimit: 1,
          iiurlheight: 300,
        });

        expect(imageInfo).toEqual({ title, wikiUrl: originalWikiUrl, artistHtml });
      });
    });

    describe('when the original url cannot be parsed', () => {
      beforeEach(() => {
        WikiClient.mockImplementation(() => wikiClient);
        parse.mockImplementationOnce(() => new Error());

        wikiClient.getResultsFromApi.mockResolvedValueOnce(imageInfoMock);
      });

      it('forwards the exception thrown when attempting to parse the url', async () => {
        const service = new FetchOriginalFileData();
        expect(service.getFileData({ title, wikiUrl })).rejects.toThrow('badData');
      });
    });
  });
});
