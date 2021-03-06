const setup = require('./__helpers__/setup');

const errors = require('../services/util/errors');

describe('files routes', () => {
  const files = { getPageImages: jest.fn() };
  const services = { files };
  const filesMock = [
    {
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:Graphic_01.jpg',
      fileSize: 112450,
      rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Graphic_01.jpg',
      thumbnail: {
        height: 300,
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Graphic_01.jpg/300px-Graphic_01.jpg',
        width: 300,
      },
      title: 'File:Graphic 01.jpg',
    },
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
    const articleUrl = 'https://en.wikipedia.org/wiki/Wikimedia_Foundation';
    const encodedArticleUrl = encodeURIComponent(articleUrl);

    async function subject(options = {}) {
      const defaults = { method: 'GET' };
      return context.inject({ ...defaults, ...options });
    }

    it('returns a list of all files from the given article', async () => {
      files.getPageImages.mockResolvedValue(filesMock);

      const response = await subject({ url: `/files/${encodedArticleUrl}` });

      expect(files.getPageImages).toHaveBeenCalledWith(articleUrl);
      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns a 400 response for non http(s) urls', async () => {
      const sftpUrl = 'sftp://en.wikipedia.org/wiki/Wikimedia_Foundation';
      const encodedSftpUrl = encodeURIComponent(sftpUrl);
      const response = await subject({ url: `/files/${encodedSftpUrl}` });

      expect(files.getPageImages).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns 400 response if the URL is invalid', async () => {
      const response = await subject({ url: '/files/something-invalid' });

      expect(files.getPageImages).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns a 422 response for non-wiki urls', async () => {
      files.getPageImages.mockImplementation(() => {
        throw new Error(errors.invalidUrl);
      });

      const response = await subject({ url: `/files/${encodedArticleUrl}` });

      expect(files.getPageImages).toHaveBeenCalledWith(articleUrl);
      expect(response.status).toBe(422);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns a 500 response for a generic error', async () => {
      files.getPageImages.mockImplementation(() => {
        throw new Error('just some error');
      });

      const response = await subject({ url: `/files/${encodedArticleUrl}` });

      expect(files.getPageImages).toHaveBeenCalledWith(articleUrl);
      expect(response.status).toBe(500);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns a 503 response when the wiki api is not reachable', async () => {
      files.getPageImages.mockImplementation(() => {
        throw new Error(errors.apiUnavailabe);
      });

      const response = await subject({ url: `/files/${encodedArticleUrl}` });

      expect(files.getPageImages).toHaveBeenCalledWith(articleUrl);
      expect(response.status).toBe(503);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    it('returns a 404 when called with an unencoded articleUrl', async () => {
      const rawArticleUrl = 'https://en.wikipedia.org/wiki/Wikimedia_Foundation';

      const response = await subject({ url: `/files/${rawArticleUrl}` });

      expect(files.getPageImages).not.toHaveBeenCalled();
      expect(response.status).toBe(404);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });
  });
});
