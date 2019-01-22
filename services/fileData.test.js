const FileData = require('./fileData');

const errors = require('../services/util/errors');
const imageInfoMock = require('./__fixtures__/imageInfo');
const imageInfoWithoutArtistMock = require('./__fixtures__/imageInfoWithoutArtist');
const imageInfoWithoutAttributionMock = require('./__fixtures__/imageInfoWithoutAttribution');
const imageInfoWithoutNormalizationMock = require('./__fixtures__/imageInfoWithoutNormalization');

describe('FileData', () => {
  const client = { getResultsFromApi: jest.fn() };

  describe('getFileData', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const normalizedTitle = 'File:Apple Lisa2-IMG 1517.jpg';
    const wikiUrl = 'https://commons.wikimedia.org/';
    const artistHtml =
      '<a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a> &amp; Musée Bolo';
    const attributionHtml =
      'Photograph by <a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a>, Wikimedia Commons, Cc-by-sa-2.0-fr';
    const rawUrl = 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Apple_Lisa2-IMG_1517.jpg';

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
            iiprop: 'url|extmetadata|mediatype',
            iilimit: 1,
            iiurlheight: 300,
          }
        );
        expect(fileData).toEqual({
          title,
          normalizedTitle,
          rawUrl,
          wikiUrl,
          artistHtml,
          attributionHtml,
        });
      });

      it('skips the artist information if not available for the file', async () => {
        client.getResultsFromApi.mockResolvedValueOnce(imageInfoWithoutArtistMock);

        const service = new FileData({ client });
        const fileData = await service.getFileData(url);

        expect(fileData).toEqual({
          title,
          normalizedTitle,
          rawUrl,
          wikiUrl,
          artistHtml: null,
          attributionHtml,
        });
      });

      it('skips the attribution information if not available for the file', async () => {
        client.getResultsFromApi.mockResolvedValueOnce(imageInfoWithoutAttributionMock);

        const service = new FileData({ client });
        const fileData = await service.getFileData(url);

        expect(fileData).toEqual({
          title,
          normalizedTitle,
          rawUrl,
          wikiUrl,
          artistHtml,
          attributionHtml: null,
        });
      });

      it("returns the title if the title didn't need normalization", async () => {
        client.getResultsFromApi.mockResolvedValueOnce(imageInfoWithoutNormalizationMock);

        const service = new FileData({ client });
        const fileData = await service.getFileData(url);

        expect(fileData).toEqual({
          title,
          normalizedTitle: title,
          rawUrl,
          wikiUrl,
          artistHtml,
          attributionHtml,
        });
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
          iiprop: 'url|extmetadata|mediatype',
          iilimit: 1,
          iiurlheight: 300,
        });
        expect(fileData).toEqual({
          title,
          normalizedTitle,
          rawUrl,
          wikiUrl,
          artistHtml,
          attributionHtml,
        });
      });

      it('throws an exception when the title has the wrong format', async () => {
        const service = new FileData({ client });
        const badTitle = 'Apple_Lisa2-IMG_1517.jpg';

        await expect(service.getFileData(badTitle)).rejects.toThrow(errors.invalidUrl);
      });
    });
  });
});
