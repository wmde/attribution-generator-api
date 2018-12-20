const setup = require('./__helpers__/setup');

describe('license routes', () => {
  let context;

  const licenseStore = { all: jest.fn() };

  beforeEach(async () => {
    context = await setup({ services: { licenses: licenseStore } });
  });

  afterEach(async () => {
    await context.destroy();
  });

  describe('GET /licenses', () => {
    const licenses = [
      {
        url: 'https://foo.bar/path with spaces',
        name: 'bar',
      },
      {
        url: 'https://foo.bar/just-a-regular-path',
        name: 'foo',
      },
    ];

    function options() {
      return { url: `/licenses`, method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    }

    beforeEach(() => {
      licenseStore.all.mockReturnValue(licenses);
    });

    it('returns a list of licenses', async () => {
      const response = await subject({});

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });
  });

  describe('GET /licenses/compatible/{license}', () => {
    const license = 'CC+BY-SA+3.0';

    function options() {
      return { url: `/licenses/compatible/${license}`, method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    }

    fit('returns a list of licenses', async () => {
      const response = await subject({});

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });
  });

  describe('GET /license/{file}', () => {
    const file = 'File:Pommes-1.jpg';

    function options() {
      return { url: `/license/${file}`, method: 'GET' };
    }

    async function subject() {
      return context.inject(options());
    }

    it('returns the license of a file', async () => {
      const response = await subject({});

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.payload).toMatchSnapshot();
    });
  });
});
