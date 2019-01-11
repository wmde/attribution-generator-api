const axios = require('axios');
const Url = require('url');

const defaultParams = { action: 'query', format: 'json' };
const apiPath = 'w/api.php';

function transform(data) {
  const { query } = data;
  return query;
}

class Client {
  constructor() {
    this.client = axios.create({
      headers: {
        common: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
        },
      },
      timeout: 5000,
    });
  }

  getResultsFromApi(titles, prop, wikiUrl, params = {}) {
    const queryParams = {
      ...defaultParams,
      ...params,
      titles,
      prop,
    };
    return this.query(wikiUrl, queryParams);
  }

  async query(wikiUrl, params) {
    const apiUrl = Url.resolve(wikiUrl, apiPath);
    const { data } = await this.client.get(apiUrl, { params });
    return transform(data);
  }
}

module.exports = Client;
