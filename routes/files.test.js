const setup = require('./__helpers__/setup');

describe('files routes', () => {
  const service = { getPageImages: jest.fn() };

  let context;

  beforeEach(async () => {
    context = await setup({service});
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /files', () => {
    async function subject(options = {}) {
      const defaults = { method: 'GET' };
      return context.inject({...defaults, ...options});
    }

    const pageUrl = 'https://en.wikipedia.org/wiki/Wikimedia_Foundation';

    describe('with a valid encoded url', () => {
      const encodedPageUrl = encodeURIComponent(pageUrl);
      const files = [
        { file: 'File:image.jpg', url: 'https://en.wikipedia.org/wiki/File:image.jpg' }
      ];

      it('returns a list of files with their name and url', async () => {
        service.getPageImages.mockResolvedValue(files);
        const response = await subject({url: `/files/${encodedPageUrl}`});

        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(response.payload).toMatchSnapshot();
      });
    });

    describe('with an unencoded url', () => {
      it('returns a 404', async () => {
        const response = await subject({url: `/files/${pageUrl}`});
        expect(response.status).toBe(404);
      });
    });
  });
});
