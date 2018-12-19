const axios = require('axios');

const WikiClient = require('./wikiClient');

jest.mock('axios');

describe('WikiClient', () => {
  it('initializes a new axios client with defaults for header and timeout', () => {
    const headers = {
      common: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      },
    };
    const timeout = 5000;

    const subject = new WikiClient(); // eslint-disable-line no-unused-vars

    expect(axios.create).toHaveBeenCalledWith({ headers, timeout });
  });

  describe('getResultsFromApi()', () => {
    const axiosClient = { get: jest.fn() };
    const wikiUrl = 'https://en.wikipedia.org';
    const apiUrl = 'https://en.wikipedia.org/w/api.php';
    const defaultParams = { action: 'query', format: 'json' };
    const response = { data: { query: { foo: 'bar' } } };

    describe('when querying for images of a page', () => {
      const titles = 'Def_Leppard';
      const prop = 'image';
      const params = { ...defaultParams, prop, titles };

      it('calls the respective api and returs the query result', async () => {
        axiosClient.get.mockResolvedValue(response);
        axios.create.mockReturnValue(axiosClient);

        const client = new WikiClient();
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
        axiosClient.get.mockResolvedValue(response);
        axios.create.mockReturnValue(axiosClient);

        const client = new WikiClient();
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
