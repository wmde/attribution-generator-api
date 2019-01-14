const Licenses = require('./licenses');

const templatesMock = require('./__fixtures__/templates');
const templatesMissingMock = require('./__fixtures__/templatesMissing');

describe('Licenses', () => {
  const client = { getResultsFromApi: jest.fn() };
  const licenseStore = { match: jest.fn() };

  describe('getLicense()', () => {
    const service = new Licenses({ client, licenseStore });
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const wikiUrl = 'https://en.wikipedia.org';
    const licenseMock = {};
    const normalizedTemplates = [
      'CC-Layout',
      'Cc-by-sa-3.0-migrated',
      'Description',
      'Dir',
      'En',
      'Es',
      'Fr',
      'GFDL',
      'GNU-Layout',
      'License migration',
      'License migration complete',
      'License template tag',
      'Original upload log',
    ];

    it('returns a license based on the templates for the file page', async () => {
      client.getResultsFromApi.mockResolvedValueOnce(templatesMock);
      licenseStore.match.mockImplementation(() => licenseMock);

      const license = await service.getLicense({ title, wikiUrl });

      expect(client.getResultsFromApi).toHaveBeenCalledWith(title, 'templates', wikiUrl, {
        tlnamespace: 10,
        tllimit: 100,
      });
      expect(licenseStore.match).toHaveBeenCalledWith(normalizedTemplates);
      expect(license).toEqual(licenseMock);
    });

    it('returns null when no templates are available', async () => {
      client.getResultsFromApi.mockResolvedValueOnce(templatesMissingMock);
      licenseStore.match.mockImplementation(() => null);

      const license = await service.getLicense({ title, wikiUrl });

      expect(licenseStore.match).toHaveBeenCalledWith([]);
      expect(license).toBe(null);
    });

    it('throws a notFound error if the response is fully empty', async () => {
      client.getResultsFromApi.mockResolvedValueOnce({});
      expect(service.getLicense({ title, wikiUrl })).rejects.toThrow('notFound');
    });
  });
});
