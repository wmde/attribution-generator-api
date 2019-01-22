const axios = require('axios');
const chunk = require('lodash.chunk');
const Url = require('url');

const errors = require('./errors');

const defaultParams = { action: 'query', format: 'json' };
const apiPath = 'w/api.php';
const maxTitles = 50;

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

function batchRequest({ batch, client, wikiUrl, params }) {
  const titles = batch.join('|');
  return queryApi({ client, wikiUrl, params: { ...params, titles } });
}

function mergePages(responses) {
  return responses
    .map(response => response.pages)
    .reduce((pages, page) => Object.assign(pages, page));
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

  async getResultsFromApi(titles, prop, wikiUrl, params = {}) {
    const { client } = this;
    const titleBatches = chunk(titles, maxTitles);
    const queryParams = {
      ...defaultParams,
      ...params,
      prop,
    };
    const responses = await axios.all(
      titleBatches.map(batch => batchRequest({ batch, client, wikiUrl, params: queryParams }))
    );
    return { pages: mergePages(responses) };
  }
}

module.exports = Client;
