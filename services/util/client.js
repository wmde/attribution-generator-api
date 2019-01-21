const axios = require('axios');
const assert = require('assert');
const Url = require('url');

const errors = require('./errors');

const defaultParams = { action: 'query', format: 'json' };
const apiPath = 'w/api.php';

function transform(data) {
  assert.ok(data.query, errors.emptyResponse);
  const {
    query: { pages },
  } = data;
  assert.ok(pages, errors.emptyResponse);
  return pages;
}

function handleError(error) {
  if (!error.response) throw new Error(errors.apiUnavailabe);
  throw error;
}

function dataIsComplete(data) {
  return 'batchcomplete' in data;
}

async function performRequest({ client, apiUrl, params }) {
  try {
    const response = await client.get(apiUrl, { params });
    return response;
  } catch (error) {
    return handleError(error);
  }
}

async function queryApi({ client, wikiUrl, params }, existingPages = {}) {
  const apiUrl = Url.resolve(wikiUrl, apiPath);
  const { data } = await performRequest({ client, apiUrl, params });
  const pages = { ...existingPages, ...transform(data) };
  if (dataIsComplete(data)) return { pages };

  const { continue: pagingParams } = data;
  return queryApi({ client, wikiUrl, params: { ...params, ...pagingParams } }, pages);
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
    const titleString = titles.join('|');
    const queryParams = {
      ...defaultParams,
      ...params,
      titles: titleString,
      prop,
    };
    return queryApi({ client, wikiUrl, params: queryParams });
  }
}

module.exports = Client;
