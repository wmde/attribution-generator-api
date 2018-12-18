const setup = require('./__helpers__/setup');

describe('files routes', () => {
  let context;

  beforeEach(async () => {
    context = await setup({});
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /files', () => {
    function options() {
      return { url: '/files', method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    }

    it('returns a list of files with their name and url', async () => {
      const response = await subject({});
      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });
  });
});
