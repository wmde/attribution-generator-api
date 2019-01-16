const axios = require('axios');
const Url = require('url');

const errors = require('./errors');

const defaultParams = { action: 'query', format: 'json' };
const apiPath = 'w/api.php';

function transform(data) {
  const { query } = data;
  return query;
}

function handleError(error) {
  if (!error.response) throw new Error(errors.apiUnavailabe);
  throw error;
}

async function queryApi({ client, wikiUrl, params }) {
  const apiUrl = Url.resolve(wikiUrl, apiPath);
  try {
    const { data } = await client.get(apiUrl, { params });
    return transform(data);
  } catch (error) {
    return handleError(error);
  }
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
    const { client } = this;
    const queryParams = {
      ...defaultParams,
      ...params,
      titles,
      prop,
    };
    return queryApi({ client, wikiUrl, params: queryParams });
  }
}

module.exports = Client;
