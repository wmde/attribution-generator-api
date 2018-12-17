const setup = require('./__helpers__/setup');
const pkg = require('../package.json');

describe('info routes', () => {
  let context;

  beforeEach(async () => {
    context = await setup({});
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /info', () => {
    async function subject() {
      const options = { url: '/info', method: 'GET' };
      return context.inject(options);
    }

    it('returns API status information', async () => {
      const response = await subject({});
      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload.version).toBe(pkg.version);
    });
  });
});
