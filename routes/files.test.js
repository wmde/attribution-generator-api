const setup = require('./__helpers__/setup');

const errors = require('../services/util/errors');

describe('files routes', () => {
  const files = { getPageImages: jest.fn() };
  const services = { files };
  const filesMock = [
    { file: 'File:image.jpg', url: 'https://en.wikipedia.org/wiki/File:image.jpg' },
  ];

  let context;

  beforeEach(async () => {
    files.getPageImages.mockReset();
    context = await setup({ services });
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /files', () => {
    async function subject(options = {}) {
      const defaults = { method: 'GET' };
      return context.inject({ ...defaults, ...options });
    }

    it('returns a list of all files from the given article', async () => {
      const articleUrl = 'https://en.wikipedia.org/wiki/Wikimedia_Foundation';
      const encodedArticleUrl = encodeURIComponent(articleUrl);
      files.getPageImages.mockResolvedValue(filesMock);

      const response = await subject({ url: `/files/${encodedArticleUrl}` });

      expect(files.getPageImages).toHaveBeenCalledWith(articleUrl);
      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns 422 response if the URL is invalid', async () => {
      const articleUrl = 'something-invalid';
      files.getPageImages.mockImplementation(() => {
        throw new Error(errors.invalidUrl);
      });

      const response = await subject({ url: `/files/${articleUrl}` });

      expect(files.getPageImages).toHaveBeenCalledWith(articleUrl);
      expect(response.status).toBe(422);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns a 500 response for a generic error', async () => {
      const articleUrl = 'something-random';
      files.getPageImages.mockImplementation(() => {
        throw new Error('just some error');
      });

      const response = await subject({ url: `/files/${articleUrl}` });

      expect(files.getPageImages).toHaveBeenCalledWith(articleUrl);
      expect(response.status).toBe(500);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns a 503 response when the wiki api is not reachable', async () => {
      const articleUrl = 'something-random';
      files.getPageImages.mockImplementation(() => {
        throw new Error(errors.apiUnavailabe);
      });

      const response = await subject({ url: `/files/${articleUrl}` });

      expect(files.getPageImages).toHaveBeenCalledWith(articleUrl);
      expect(response.status).toBe(503);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns a 404 when called with an unencoded articleUrl', async () => {
      const articleUrl = 'https://en.wikipedia.org/wiki/Wikimedia_Foundation';

      const response = await subject({ url: `/files/${articleUrl}` });

      expect(files.getPageImages).not.toHaveBeenCalled();
      expect(response.status).toBe(404);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });
  });
});
