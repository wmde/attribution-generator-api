const Licenses = require('./licenses');

const WikiClient = require('./wikiClient');
const parse = require('./parseWikiUrl');

const imageInfo = require('./__fixtures__/imageInfo');
const templates = require('./__fixtures__/templates');

jest.mock('./wikiClient');
jest.mock('./parseWikiUrl');

describe('Licenses', () => {
  const wikiClient = { getResultsFromApi: jest.fn() };

  describe('getLicenseForFile()', () => {
    describe('with a valid wikiUrl', () => {
      const url = 'https://en.wikipedia.org/wiki/Apple_Lisa#/media/File:Apple_Lisa.jpg';
      const title = 'File:Apple_Lisa.jpg';
      const wikiUrl = 'https://en.wikipedia.org';
      const fileWikiUrl = 'https://commons.wikipedia.org/';

      beforeEach(() => {
        WikiClient.mockImplementation(() => wikiClient);
        parse.mockImplementationOnce(() => ({ title, wikiUrl }));
        parse.mockImplementationOnce(() => ({ title, wikiUrl: fileWikiUrl }));
      });

      it('gets the file location and returns a matching license based on the page templates', async () => {
        wikiClient.getResultsFromApi
          .mockResolvedValueOnce(imageInfo)
          .mockResolvedValueOnce(templates);

        const service = new Licenses();
        const license = await service.getLicenseForFile(url);

        expect(parse).toHaveBeenCalledWith(url);
        expect(wikiClient.getResultsFromApi).toHaveBeenCalledWith(title, 'imageinfo', wikiUrl, {
          iiprop: 'url',
          iilimit: 1,
          iiurlheight: 300,
        });
        expect(wikiClient.getResultsFromApi).toHaveBeenCalledWith(title, 'templates', fileWikiUrl, {
          tlnamespace: 10,
          tllimit: 100,
        });

        expect(license).toMatchSnapshot();
      });
    });

    describe('with an invalid wikiUrl', () => {
      const url = 'https://en.pokepeidia.org/wiki/Apple_Lisa#/media/File:Apple_Lisa.jpg';

      beforeEach(() => {
        WikiClient.mockImplementation(() => wikiClient);
        parse.mockImplementationOnce(() => null);
      });

      it('raises an error', async () => {
        const service = new Licenses();
        await expect(service.getLicenseForFile(url)).rejects.toThrow('badRequest');
      });
    });
  });
});
