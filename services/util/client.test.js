const axios = require('axios');

const Client = require('./client');

jest.mock('axios');

describe('Client', () => {
  const axiosClient = { get: jest.fn() };

  beforeEach(() => axios.create.mockReturnValue(axiosClient));

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
    const mockedResponse = { data: { query: { foo: 'bar' } } };

    it('returns an error if the API cannot be reached', async () => {
      const titles = 'Def_Leppard';
      const error = { request: {} };
      axiosClient.get.mockImplementation(() => {
        throw error;
      });
      const client = new Client();

      await expect(client.getResultsFromApi(titles, 'image', wikiUrl)).rejects.toThrow(
        'api-unavailable'
      );
    });

    it('passes on any errors from doing the request', async () => {
      const titles = 'Def_Leppard';
      axiosClient.get.mockImplementation(() => {
        throw new Error();
      });
      const client = new Client();

      await expect(client.getResultsFromApi(titles, 'image', wikiUrl)).rejects.toThrow();
    });

    it('allows querying for images of a page', async () => {
      const titles = 'Def_Leppard';
      const prop = 'image';
      const params = { ...defaultParams, prop, titles };

      axiosClient.get.mockResolvedValue(mockedResponse);

      const client = new Client();
      const subject = await client.getResultsFromApi(titles, 'image', wikiUrl);

      expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, { params });
      expect(subject).toEqual({ foo: 'bar' });
    });

    it('allows querying for multiple titles with additional params', async () => {
      const titles = 'File:Steve_Clark.jpeg|File:RickAllen.JPG';
      const prop = 'imageInfo';
      const params = { ...defaultParams, prop, titles, iiprop: 'url' };

      axiosClient.get.mockResolvedValue(mockedResponse);

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
