const setup = require('./__helpers__/setup');

describe('license routes', () => {
  let context;

  beforeEach(async () => {
    context = await setup();
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /licenses', () => {
    function options() {
      return { url: `/licenses`, method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    };

    it('returns a list of licenses', async () => {
      const response = await subject({});

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });
  });
});