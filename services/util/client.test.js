const axios = require('axios');

const errors = require('./errors');
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
    const page1 = {
      848165: {
        pageid: 848165,
        ns: 0,
        title: 'Article Title',
        images: [
          {
            ns: 6,
            title: 'File:Graphic 01.jpg',
          },
          {
            ns: 6,
            title: 'File:logo.svg',
          },
        ],
      },
    };
    const page2 = {
      846667: {
        pageid: 846667,
        ns: 0,
        title: 'Article Title 2',
        images: [
          {
            ns: 6,
            title: 'File:Graphic 02.jpg',
          },
        ],
      },
    };
    const pages = page1;
    const mockedResponse = { data: { batchcomplete: '', query: { pages } } };

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

    it('returns an error if the response does not contain pages', async () => {
      const titleString = 'Def_Leppard';
      const titles = [titleString];
      const prop = 'image';
      const params = { ...defaultParams, prop, titles: titleString };

      const emptyResponse = { data: { batchcomplete: '' } };
      axiosClient.get.mockResolvedValue(emptyResponse);

      const client = new Client();

      await expect(client.getResultsFromApi(titles, 'image', wikiUrl)).rejects.toThrow(
        errors.emptyResponse
      );
      expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, { params });
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
      expect(subject).toEqual({ pages });
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
      expect(subject).toEqual({ pages });
    });

    it('aggregates the results of paged responses', async () => {
      const titleString = 'Def_Leppard';
      const titles = [titleString];
      const prop = 'image';
      const params = { ...defaultParams, prop, titles: titleString };
      const continueParams = { tlcontinue: '46565|10|Tl', continue: '||' };

      const mockedResponse1 = { data: { continue: continueParams, query: { pages: page1 } } };
      const mockedResponse2 = { data: { batchcomplete: '', query: { pages: page2 } } };
      axiosClient.get.mockResolvedValueOnce(mockedResponse1).mockResolvedValueOnce(mockedResponse2);

      const client = new Client();
      const subject = await client.getResultsFromApi(titles, 'image', wikiUrl);

      expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, { params });
      expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, {
        params: { ...params, ...continueParams },
      });
      expect(subject).toEqual({ pages: { ...page1, ...page2 } });
    });

    it('correctly merges the results of paged responses if they are the same', async () => {
      const titleString = 'Def_Leppard';
      const titles = [titleString];
      const prop = 'image';
      const params = { ...defaultParams, prop, titles: titleString };
      const continueParams = { tlcontinue: '46565|10|Tl', continue: '||' };

      const mockedResponse1 = { data: { continue: continueParams, query: { pages: page1 } } };
      const mockedResponse2 = { data: { batchcomplete: '', query: { pages: page1 } } };
      axiosClient.get.mockResolvedValueOnce(mockedResponse1).mockResolvedValueOnce(mockedResponse2);

      const client = new Client();
      const subject = await client.getResultsFromApi(titles, 'image', wikiUrl);

      expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, { params });
      expect(axiosClient.get).toHaveBeenCalledWith(apiUrl, {
        params: { ...params, ...continueParams },
      });
      expect(subject).toEqual({ pages });
    });
  });
});
