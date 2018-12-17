const setup = require('./__helpers__/setup');

describe('attribution routes', () => {
  const generator = { generate: jest.fn() };

  let context;

  beforeEach(async () => {
    context = await setup({ generator });
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /attribution/…', () => {
    function options(overrides = {}) {
      const defaults = { file: 'File:…' };
      const params = { ...defaults, ...overrides };
      return { url: `/attribution/${params.file}/…`, method: 'GET' };
    }

    async function subject(overrides = {}) {
      return context.inject(options(overrides));
    }

    afterEach(() => {
      generator.generate.mockReset();
    });

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('responds with attribution data for the given file', async () => {
      generator.generate.mockResolvedValue({
        /* TODO */
      });

      const response = await subject({});

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('responds with 400 if …', async () => {
      const response = await subject({});
      expect(response.status).toBe(400);
      // expect(…).toBe(…);
    });
  });
});
