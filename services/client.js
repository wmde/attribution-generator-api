const axios = require('axios');
const Url = require('url');

// TODO: WikiClient
// add default params as constant
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

  getResultsFromApi(titles, prop, wikiUrl, params) {
    const queryParams = {
      ...params,
      action: 'query',
      format: 'json',
      prop,
      titles,
    };
    return this.query(wikiUrl, queryParams);
  }

  async query(wikiUrl, params) {
    const path = Url.resolve(wikiUrl, 'w/api.php');
    const { data } = await this.client.get(path, { params });
    const result = transform(data);
    return result;
  }
}

module.exports = new Client();
