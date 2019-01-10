const ParseFileTitle = require('./parseFileTitle');

const FetchOriginalFileData = require('./fetchOriginalFileData');

jest.mock('./fetchOriginalFileData');

describe('ParseFileTitle', () => {
  const fetchOriginalFileData = { getFileData: jest.fn() };

  beforeEach(() => FetchOriginalFileData.mockImplementation(() => fetchOriginalFileData));

  describe('enhanceFileIdentifier', () => {
    describe('when file data is available', () => {
      const title = 'File:Apple_Lisa2-IMG_1517.jpg';
      const wikiUrl = 'https://ch.wikipedia.org';
      const commonsUrl = 'https://commons.wikimedia.org';
      const artistHtml = 'Ada L';
      const fileDataMock = { title, wikiUrl, artistHtml };

      beforeEach(() => fetchOriginalFileData.getFileData.mockResolvedValueOnce(fileDataMock));

      it('defaults to the commons wikiUrl and retrieves the data via another service', async () => {
        const service = new ParseFileTitle();
        const fileData = await service.enhanceFileIdentifier(title);

        expect(fetchOriginalFileData.getFileData).toHaveBeenCalledWith({
          title,
          wikiUrl: commonsUrl,
        });

        expect(fileData).toEqual(fileDataMock);
      });
    });

    describe('when the title does not have the right format', () => {
      const title = 'Apple_Lisa2-IMG_1517.jpg';

      it('throws a 422 exception', () => {
        const service = new ParseFileTitle();
        expect(() => service.enhanceFileIdentifier(title)).toThrow('badData');
      });
    });
  });
});
