const FetchOriginalFileData = require('./fetchOriginalFileData');

const parse = require('./util/parseWikiUrl');

const imageInfoMock = require('./__fixtures__/imageInfo');
const imageInfoWithoutArtistMock = require('./__fixtures__/imageInfoWithoutArtist');

jest.mock('./util/parseWikiUrl');

describe('FetchOriginalFileData', () => {
  const client = { getResultsFromApi: jest.fn() };

  describe('getFileData', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const wikiUrl = 'https://en.wikipedia.org';
    const originalWikiUrl = 'https://commons.wikimedia.org/';

    describe('when all all data is available', () => {
      const artistHtml =
        '<a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a> &amp; Musée Bolo';

      beforeEach(() => {
        parse.mockImplementationOnce(() => ({ title, wikiUrl: originalWikiUrl }));
        client.getResultsFromApi.mockResolvedValueOnce(imageInfoMock);
      });

      it('retrieves the original wikiUrl, title and artistHtml information', async () => {
        const service = new FetchOriginalFileData({ client });
        const imageInfo = await service.getFileData({ title, wikiUrl });

        expect(client.getResultsFromApi).toHaveBeenCalledWith(title, 'imageinfo', wikiUrl, {
          iiprop: 'url|extmetadata',
          iilimit: 1,
          iiurlheight: 300,
        });

        expect(imageInfo).toEqual({ title, wikiUrl: originalWikiUrl, artistHtml });
      });
    });

    describe('when the original url cannot be parsed', () => {
      const message = 'badData';

      beforeEach(() => {
        client.getResultsFromApi.mockResolvedValueOnce(imageInfoMock);
        parse.mockImplementationOnce(() => new Error(message));
      });

      it('forwards the exception thrown when attempting to parse the url', async () => {
        const service = new FetchOriginalFileData({ client });
        await service
          .getFileData({ title, wikiUrl })
          .catch(e => expect(e).toMatchObject({ message }));
      });
    });

    describe('when the imageinfo response does not include pages', () => {
      const message = 'notFound';

      beforeEach(() => client.getResultsFromApi.mockResolvedValueOnce({}));

      it('throws a notFound error', async () => {
        const service = new FetchOriginalFileData({ client });
        await service
          .getFileData({ title, wikiUrl })
          .catch(e => expect(e).toMatchObject({ message }));
      });
    });

    describe('when the response does not include any information about the artist', () => {
      beforeEach(() => {
        parse.mockImplementationOnce(() => ({ title, wikiUrl: originalWikiUrl }));
        client.getResultsFromApi.mockResolvedValueOnce(imageInfoWithoutArtistMock);
      });

      it('retrieves the original wikiUrl, title and skips the artistHtml information', async () => {
        const service = new FetchOriginalFileData({ client });
        const imageInfo = await service.getFileData({ title, wikiUrl });

        expect(imageInfo).toEqual({ title, wikiUrl: originalWikiUrl, artistHtml: null });
      });
    });
  });
});
