const axios = require('axios');

const errors = require('./errors');
const Client = require('./client');

jest.mock('axios');

describe('Client', () => {
  const axiosClient = { get: jest.fn() };

  beforeEach(() => {
    axios.create.mockReturnValue(axiosClient);
    axios.all.mockImplementation(array => Promise.all(array));
  });

  afterEach(() => {
    axiosClient.get.mockReset();
    axios.all.mockReset();
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
    const mockedResponse = { data: { query: { pages: { foo: 'bar' } } } };

    it('returns an error if the API cannot be reached', async () => {
      const titles = ['Def_Leppard'];
      const error = { request: {} };
      axiosClient.get.mockImplementation(() => {
        throw error;
      });
      const client = new Client();

      await expect(client.getResultsFromApi(titles, 'image', wikiUrl)).rejects.toThrow(
        errors.apiUnavailabe
      );
    });

    it('passes on any errors from doing the request', async () => {
      const titles = ['Def_Leppard'];
      axiosClient.get.mockImplementation(() => {
        throw new Error();
      });
      const client = new Client();

      await expect(client.getResultsFromApi(titles, 'image', wikiUrl)).rejects.toThrow();
    });

    it('raises an error if the response does not include query object', async () => {
      const titles = ['Def_Leppard'];
      axiosClient.get.mockResolvedValue({ data: {} });
      const client = new Client();

      await expect(client.getResultsFromApi(titles, 'image', wikiUrl)).rejects.toThrow(
        errors.emptyResponse
      );
    });

    it('raises an error if the response does not include pages', async () => {
      const titles = ['Def_Leppard'];
      axiosClient.get.mockResolvedValue({ data: { query: { namespace: 'some' } } });
      const client = new Client();

      await expect(client.getResultsFromApi(titles, 'image', wikiUrl)).rejects.toThrow(
        errors.emptyResponse
      );
    });

    it('allows querying for images of a page', async () => {
      const titleString = 'Def_Leppard';
      const titles = [titleString];
      const prop = 'image';
      const params = { ...defaultParams, prop, titles: titleString };

      axiosClient.get.mockResolvedValue(mockedResponse);

      const client = new Client();
      const subject = await client.getResultsFromApi(titles, 'image', wikiUrl);

      expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, { params });
      expect(subject).toEqual({ pages: { foo: 'bar' } });
    });

    it('allows querying for multiple titles with additional params', async () => {
      const titles = ['File:Steve_Clark.jpeg', 'File:RickAllen.JPG'];
      const titleString = 'File:Steve_Clark.jpeg|File:RickAllen.JPG';
      const prop = 'imageInfo';
      const params = { ...defaultParams, prop, titles: titleString, iiprop: 'url' };

      axiosClient.get.mockResolvedValue(mockedResponse);

      const client = new Client();
      const subject = await client.getResultsFromApi(titles, prop, wikiUrl, {
        titles,
        iiprop: 'url',
      });

      expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, { params });
      expect(subject).toEqual({ pages: { foo: 'bar' } });
    });

    it('combines the results of multiple requests if the number of titles is too many', async () => {
      const titles = [...Array(55).keys()];
      const prop = 'imageInfo';
      const batch1 =
        '0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49';
      const batch2 = '50|51|52|53|54';
      const baseParams = { ...defaultParams, prop, iiprop: 'url' };
      const params1 = { ...baseParams, titles: batch1 };
      const params2 = { ...baseParams, titles: batch2 };

      axiosClient.get = jest
        .fn()
        .mockImplementation((url, { params }) =>
          Promise.resolve({ data: { query: { pages: { [params.titles]: {} } } } })
        );

      const client = new Client();
      const subject = await client.getResultsFromApi(titles, prop, wikiUrl, {
        titles,
        iiprop: 'url',
      });

      expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, { params: params1 });
      expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, { params: params2 });

      expect(subject).toEqual({
        pages: {
          [batch1]: {},
          [batch2]: {},
        },
      });
    });
  });
});
