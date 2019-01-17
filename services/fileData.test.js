const FileData = require('./fileData');

const errors = require('../services/util/errors');
const imageInfoMock = require('./__fixtures__/imageInfo');
const imageInfoWithoutArtistMock = require('./__fixtures__/imageInfoWithoutArtist');

describe('FileData', () => {
  const client = { getResultsFromApi: jest.fn() };

  describe('getFileData', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const wikiUrl = 'https://commons.wikimedia.org/';
    const artistHtml =
      '<a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a> &amp; Musée Bolo';

    describe('when passing a valid url', () => {
      const url = 'https://en.wikipedia.org/wiki/Apple_Lisa#/media/File:Apple_Lisa.jpg';

      it('retrieves the original file data', async () => {
        client.getResultsFromApi.mockResolvedValueOnce(imageInfoMock);

        const service = new FileData({ client });
        const fileData = await service.getFileData(url);

        expect(client.getResultsFromApi).toHaveBeenCalledWith(
          ['File:Apple_Lisa.jpg'],
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

        const service = new FileData({ client });
        const fileData = await service.getFileData(url);

        expect(fileData).toEqual({ title, wikiUrl, artistHtml: null });
      });

      it('throws an error when the imageinfo response is empty', async () => {
        client.getResultsFromApi.mockResolvedValueOnce({});

        const service = new FileData({ client });

        await expect(service.getFileData(url)).rejects.toThrow(errors.emptyResponse);
      });
    });

    describe('when passing only a title', () => {
      it('retrieves the original file data defaulting to the commons API', async () => {
        client.getResultsFromApi.mockResolvedValueOnce(imageInfoMock);

        const service = new FileData({ client });
        const fileData = await service.getFileData(title);

        expect(client.getResultsFromApi).toHaveBeenCalledWith([title], 'imageinfo', wikiUrl, {
          iiprop: 'url|extmetadata',
          iilimit: 1,
          iiurlheight: 300,
        });
        expect(fileData).toEqual({ title, wikiUrl, artistHtml });
      });

      it('throws an exception when the title has the wrong format', async () => {
        const service = new FileData({ client });
        const badTitle = 'Apple_Lisa2-IMG_1517.jpg';

        await expect(service.getFileData(badTitle)).rejects.toThrow(errors.invalidUrl);
      });
    });
  });
});
