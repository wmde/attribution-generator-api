const FetchTemplates = require('./fetchTemplates');

const WikiClient = require('./wikiClient');

const templatesMock = require('./__fixtures__/templates');
const emptyTemplatesMock = require('./__fixtures__/emptyTemplates');

jest.mock('./wikiClient');
jest.mock('./parseWikiUrl');

describe('FetchTemplates', () => {
  const wikiClient = { getResultsFromApi: jest.fn() };

  beforeEach(() => WikiClient.mockImplementation(() => wikiClient));

  describe('getPageTemplates', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const wikiUrl = 'https://en.wikipedia.org';

    describe('when templates are available', () => {
      beforeEach(() => wikiClient.getResultsFromApi.mockResolvedValueOnce(templatesMock));

      it('returns an array of normalized template strings', async () => {
        const service = new FetchTemplates();
        const templates = await service.getPageTemplates({ title, wikiUrl });

        expect(wikiClient.getResultsFromApi).toHaveBeenCalledWith(title, 'templates', wikiUrl, {
          tlnamespace: 10,
          tllimit: 100,
        });

        expect(templates).toEqual([
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
        ]);
      });
    });

    describe('when the response is empty (has no pages)', () => {
      beforeEach(() => wikiClient.getResultsFromApi.mockResolvedValueOnce({}));

      it('throws a notFound error', async () => {
        const service = new FetchTemplates();
        expect(service.getPageTemplates({ title, wikiUrl })).rejects.toThrow('notFound');
      });
    });

    describe('when no templates can be retrieved', () => {
      beforeEach(() => wikiClient.getResultsFromApi.mockResolvedValueOnce(emptyTemplatesMock));

      it('returns an empy array', async () => {
        const service = new FetchTemplates();
        const templates = await service.getPageTemplates({ title, wikiUrl });
        expect(templates).toEqual([]);
      });
    });
  });
});
