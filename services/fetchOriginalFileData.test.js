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
      });

      it('retrieves the original wikiUrl, title and artistHtml information', async () => {
        wikiClient.getResultsFromApi.mockResolvedValueOnce(imageInfoMock);

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
  });
});
