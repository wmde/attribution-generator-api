const RetrieveLicense = require('./retrieveLicense');

const License = require('../models/license');
const FetchTemplates = require('./fetchTemplates');

jest.mock('./fetchTemplates');

describe('RetrieveLicense', () => {
  const fetchTemplates = { getPageTemplates: jest.fn() };

  beforeEach(() => FetchTemplates.mockImplementation(() => fetchTemplates));

  describe('getLicenseForFile', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const wikiUrl = 'https://commons.wikimedia.org';
    const templates = ['CC-Layout', 'Cc-by-sa-3.0-migrated', 'Description'];

    describe('when templates are available', () => {
      beforeEach(() => fetchTemplates.getPageTemplates.mockResolvedValueOnce(templates));

      it('passes the retrieved templates to the LicenseStore and returns a license', async () => {
        const service = new RetrieveLicense();
        const license = await service.getLicenseForFile({ title, wikiUrl });

        expect(fetchTemplates.getPageTemplates).toHaveBeenCalledWith({ title, wikiUrl });

        expect(license).toBeInstanceOf(License);
      });
    });

    describe('when no templates are available', () => {
      beforeEach(() => fetchTemplates.getPageTemplates.mockResolvedValueOnce([]));

      it('returns null', async () => {
        const service = new RetrieveLicense();
        const license = await service.getLicenseForFile({ title, wikiUrl });

        expect(fetchTemplates.getPageTemplates).toHaveBeenCalledWith({ title, wikiUrl });

        expect(license).toBe(null);
      });
    });
  });
});
