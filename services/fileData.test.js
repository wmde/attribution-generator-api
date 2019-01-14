const FileData = require('./fileData');

const imageInfoMock = require('./__fixtures__/imageInfo');
const imageInfoWithoutArtistMock = require('./__fixtures__/imageInfoWithoutArtist');

describe('FileData', () => {
  const client = { getResultsFromApi: jest.fn() };
  const service = new FileData({ client });

  describe('getFileData', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const wikiUrl = 'https://commons.wikimedia.org/';
    const artistHtml =
      '<a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a> &amp; Musée Bolo';

    describe('when passing a valid url', () => {
      const titleOrUrl = 'https://en.wikipedia.org/wiki/Apple_Lisa#/media/File:Apple_Lisa.jpg';

      it('retrieves the original file data', async () => {
        client.getResultsFromApi.mockResolvedValueOnce(imageInfoMock);

        const fileData = await service.getFileData(titleOrUrl);

        expect(client.getResultsFromApi).toHaveBeenCalledWith(
          'File:Apple_Lisa.jpg',
          'imageinfo',
          'https://en.wikipedia.org/',
          {
            iiprop: 'url|extmetadata',
            iilimit: 1,
            iiurlheight: 300,
          }
        );
        expect(fileData).toEqual({ title, wikiUrl, artistHtml });
      });

      it('skips the artist information if not available for the file', async () => {
        client.getResultsFromApi.mockResolvedValueOnce(imageInfoWithoutArtistMock);

        const fileData = await service.getFileData(titleOrUrl);

        expect(fileData).toEqual({ title, wikiUrl, artistHtml: null });
      });

      it('throws a notFound error when the imageinfo response is empty', async () => {
        client.getResultsFromApi.mockResolvedValueOnce({});
        await service
          .getFileData(titleOrUrl)
          .catch(e => expect(e).toMatchObject({ message: 'notFound' }));
      });
    });

    describe('when passing only a title', () => {
      it('retrieves the original file data defaulting to the commons API', async () => {
        client.getResultsFromApi.mockResolvedValueOnce(imageInfoMock);

        const fileData = await service.getFileData(title);

        expect(client.getResultsFromApi).toHaveBeenCalledWith(title, 'imageinfo', wikiUrl, {
          iiprop: 'url|extmetadata',
          iilimit: 1,
          iiurlheight: 300,
        });
        expect(fileData).toEqual({ title, wikiUrl, artistHtml });
      });

      it('throws an exception when the title has the wrong format', () => {
        const badTitle = 'Apple_Lisa2-IMG_1517.jpg';
        expect(service.getFileData(badTitle)).rejects.toThrow('badData');
      });
    });
  });
});
