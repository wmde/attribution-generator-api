const axios = require('axios');

const Client = require('./client');

jest.mock('axios');

describe('Client', () => {
  const axiosClient = { get: jest.fn() };

  beforeEach(() => {
    axios.create.mockReturnValue(axiosClient);
  });

  it('initializes a new axios client with defaults for header and timeout', () => {
    const headers = {
      common: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      },
    };
    const timeout = 5000;

    const subject = new Client();

    expect(axios.create).toHaveBeenCalledWith({ headers, timeout });
    expect(subject.client).toBe(axiosClient);
  });

  describe('getResultsFromApi()', () => {
    const wikiUrl = 'https://en.wikipedia.org';
    const apiUrl = 'https://en.wikipedia.org/w/api.php';
    const defaultParams = { action: 'query', format: 'json' };
    const response = { data: { query: { foo: 'bar' } } };

    beforeEach(() => {
      axiosClient.get.mockResolvedValue(response);
    });

    describe('when querying for images of a page', () => {
      const titles = 'Def_Leppard';
      const prop = 'image';
      const params = { ...defaultParams, prop, titles };

      it('calls the respective api and returns the query result', async () => {
        const client = new Client();
        const subject = await client.getResultsFromApi(titles, 'image', wikiUrl);

        expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, { params });
        expect(subject).toEqual({ foo: 'bar' });
      });
    });

    describe('when querying for imageInfo for a collection of images', () => {
      const titles = 'File:Steve_Clark.jpeg|File:RickAllen.JPG';
      const prop = 'imageInfo';
      const params = { ...defaultParams, prop, titles, iiprop: 'url' };

      it('calls the respective api and returns the query result', async () => {
        const client = new Client();
        const subject = await client.getResultsFromApi(titles, prop, wikiUrl, {
          titles,
          iiprop: 'url',
        });

        expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, { params });
        expect(subject).toEqual({ foo: 'bar' });
      });
    });
  });
});
