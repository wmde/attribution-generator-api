const Licenses = require('./licenses');

const ParseIdentifier = require('./parseIdentifier');
const RetrieveLicense = require('./retrieveLicense');

jest.mock('./parseIdentifier');
jest.mock('./retrieveLicense');

describe('Licenses', () => {
  const parseIdentifier = { getFileData: jest.fn() };
  const retrieveLicense = { getLicenseForFile: jest.fn() };
  const client = { getResultsFromApi: jest.fn() };
  const licenseStore = jest.fn();

  beforeEach(() => {
    ParseIdentifier.mockImplementation(() => parseIdentifier);
    RetrieveLicense.mockImplementation(() => retrieveLicense);
  });

  describe('getLicensee()', () => {
    describe('with a valid wikiUrl', () => {
      const url = 'https://en.wikipedia.org/wiki/Apple_Lisa#/media/File:Apple_Lisa.jpg';
      const title = 'File:Apple_Lisa.jpg';
      const wikiUrl = 'https://commons.wikipedia.org/';

      beforeEach(() => {
        parseIdentifier.getFileData.mockResolvedValueOnce({ title, wikiUrl });
        retrieveLicense.getLicenseForFile.mockResolvedValueOnce('a license');
      });

      it('gets the file location and returns a matching license based on the page templates', async () => {
        const service = new Licenses({ client, licenseStore });
        const license = await service.getLicense(url);

        expect(parseIdentifier.getFileData).toHaveBeenCalledWith(url);
        expect(retrieveLicense.getLicenseForFile).toHaveBeenCalledWith({ title, wikiUrl });

        // TODO: return a close to the real world value here
        expect(license).toEqual('a license');
      });
    });
  });
});
