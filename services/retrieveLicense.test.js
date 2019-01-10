const RetrieveLicense = require('./retrieveLicense');

const FetchTemplates = require('./fetchTemplates');

jest.mock('./fetchTemplates');

describe('RetrieveLicense', () => {
  const licenseStore = { match: jest.fn() };
  const client = { getResultsFromApi: jest.fn() };
  const fetchTemplates = { getPageTemplates: jest.fn() };

  beforeEach(() => FetchTemplates.mockImplementation(() => fetchTemplates));

  describe('getLicenseForFile', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const wikiUrl = 'https://commons.wikimedia.org';
    const templates = ['CC-Layout', 'Cc-by-sa-3.0-migrated', 'Description'];
    const licenseMock = {};

    describe('when templates are available', () => {
      beforeEach(() => {
        fetchTemplates.getPageTemplates.mockResolvedValueOnce(templates);
        licenseStore.match.mockImplementation(() => licenseMock);
      });

      it('passes the retrieved templates to the LicenseStore and returns a license', async () => {
        const service = new RetrieveLicense({ client, licenseStore });
        const license = await service.getLicenseForFile({ title, wikiUrl });

        expect(licenseStore.match).toHaveBeenCalledWith(templates);
        expect(fetchTemplates.getPageTemplates).toHaveBeenCalledWith({ title, wikiUrl });

        expect(license).toEqual(licenseMock);
      });
    });

    describe('when no templates are available', () => {
      beforeEach(() => {
        fetchTemplates.getPageTemplates.mockResolvedValueOnce([]);
        licenseStore.match.mockImplementation(() => null);
      });

      it('returns null', async () => {
        const service = new RetrieveLicense({ client, licenseStore });
        const license = await service.getLicenseForFile({ title, wikiUrl });

        expect(licenseStore.match).toHaveBeenCalledWith([]);
        expect(fetchTemplates.getPageTemplates).toHaveBeenCalledWith({ title, wikiUrl });

        expect(license).toBe(null);
      });
    });
  });
});
