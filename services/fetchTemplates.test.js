const FetchTemplates = require('./fetchTemplates');

const templatesMock = require('./__fixtures__/templates');
const emptyTemplatesMock = require('./__fixtures__/emptyTemplates');

jest.mock('./util/parseWikiUrl');

describe('FetchTemplates', () => {
  const client = { getResultsFromApi: jest.fn() };

  describe('getPageTemplates', () => {
    const title = 'File:Apple_Lisa2-IMG_1517.jpg';
    const wikiUrl = 'https://en.wikipedia.org';

    describe('when templates are available', () => {
      beforeEach(() => client.getResultsFromApi.mockResolvedValueOnce(templatesMock));

      it('returns an array of normalized template strings', async () => {
        const service = new FetchTemplates({ client });
        const templates = await service.getPageTemplates({ title, wikiUrl });

        expect(client.getResultsFromApi).toHaveBeenCalledWith(title, 'templates', wikiUrl, {
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
      beforeEach(() => client.getResultsFromApi.mockResolvedValueOnce({}));

      it('throws a notFound error', async () => {
        const service = new FetchTemplates({ client });
        expect(service.getPageTemplates({ title, wikiUrl })).rejects.toThrow('notFound');
      });
    });

    describe('when no templates can be retrieved', () => {
      beforeEach(() => client.getResultsFromApi.mockResolvedValueOnce(emptyTemplatesMock));

      it('returns an empy array', async () => {
        const service = new FetchTemplates({ client });
        const templates = await service.getPageTemplates({ title, wikiUrl });
        expect(templates).toEqual([]);
      });
    });
  });
});
