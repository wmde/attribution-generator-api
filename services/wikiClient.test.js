const WikiClient = require('./WikiClient');
const axios = require('axios');

jest.mock('axios');

describe('WikiClient', () => {
  it('initializes a new axios client with defaults for header and timeout', () => {
    const subject = new WikiClient();
    const headers = {
      common: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      }
    };
    const timeout = 5000;

    expect(axios.create).toHaveBeenCalledWith({ headers, timeout});
  });

  describe('getResultsFromApi()', () => {
    const axiosClient = { get: jest.fn() };
    const response = { data: { query: { foo: 'bar' } } };

    describe('when querying for images of a page', () => {
      const titles = 'Def_Leppard';
      const prop = 'image';
      const wikiUrl = 'https://en.wikipedia.org';
      const apiUrl = 'https://en.wikipedia.org/w/api.php';
      const params = { action: 'query', format: 'json', prop, titles }

      it('calls the respective api and returs the query result', async () => {
        axiosClient.get.mockResolvedValue(response);
        axios.create.mockReturnValue(axiosClient);

        const client = new WikiClient();
        // TODO: check if passing the title is even necessary
        const subject = await client.getResultsFromApi(titles, 'image', wikiUrl, { titles });

        expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, { params} );
        expect(subject).toEqual({foo: 'bar'});
      });
    });

    describe('when querying for imageInfo for a collection of images', () => {
      const titles = 'File:Steve_Clark.jpeg|File:RickAllen.JPG';
      const prop = 'imageInfo';
      const wikiUrl = 'https://en.wikipedia.org';
      const apiUrl = 'https://en.wikipedia.org/w/api.php';
      const params = { action: 'query', format: 'json', prop, titles, iiprop: 'url' }

      it('calls the respective api and returns the query result', async () => {
        axiosClient.get.mockResolvedValue(response);
        axios.create.mockReturnValue(axiosClient);

        const client = new WikiClient();
        // TODO: check if passing the title is even necessary
        const subject = await client.getResultsFromApi(titles, prop, wikiUrl, { titles, iiprop: 'url' });

        expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, { params} );
        expect(subject).toEqual({foo: 'bar'});
      });
    });
  });
});
