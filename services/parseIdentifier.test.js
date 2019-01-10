const ParseIdentifier = require('./parseIdentifier');

const FetchOriginalFileData = require('./fetchOriginalFileData');
const ParseFileTitle = require('./parseFileTitle');
const parseWikiUrl = require('./parseWikiUrl');

jest.mock('./fetchOriginalFileData');
jest.mock('./parseFileTitle');
jest.mock('./parseWikiUrl');

describe('ParseIdentifier', () => {
  const fetchOriginalFileData = { getFileData: jest.fn() };
  const parseFileTitle = { enhanceFileIdentifier: jest.fn() };

  beforeEach(() => {
    FetchOriginalFileData.mockImplementation(() => fetchOriginalFileData);
    ParseFileTitle.mockImplementation(() => parseFileTitle);
  });

  describe('getFileData', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const wikiUrl = 'https://commons.wikimedia.org';
    const artistHtml = 'NACA';
    const fileData = { title, wikiUrl, artistHtml };

    describe('when passing a prefixed file identifier', () => {
      const titleOrUrl = 'File:Apple_Lisa2-IMG_1517.jpg';

      beforeEach(() => parseFileTitle.enhanceFileIdentifier.mockResolvedValueOnce(fileData));

      it('calls the respective services and returns the extended file data', async () => {
        const service = new ParseIdentifier();
        const data = await service.getFileData(titleOrUrl);

        expect(parseFileTitle.enhanceFileIdentifier).toHaveBeenCalledWith(titleOrUrl);
        expect(data).toEqual(fileData);
      });
    });

    describe('when passing a url', () => {
      const titleOrUrl = 'https://en.wikipedia.org/wiki/Apple_Lisa#/media/File:Apple_Lisa.jpg';

      beforeEach(() => {
        parseWikiUrl.mockImplementation(() => ({ title, wikiUrl }));
        fetchOriginalFileData.getFileData.mockResolvedValueOnce(fileData);
      });

      it('parses the url and then enhances it with extra information', async () => {
        const service = new ParseIdentifier();
        const data = await service.getFileData(titleOrUrl);

        expect(parseWikiUrl).toHaveBeenCalledWith(titleOrUrl);
        expect(fetchOriginalFileData.getFileData).toHaveBeenCalledWith({ title, wikiUrl });
        expect(data).toEqual(fileData);
      });
    });
  });
});
