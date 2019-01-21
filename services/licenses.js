const assert = require('assert');

const errors = require('./util/errors');

function normalizeTemplateTitle(template) {
  const { title } = template;
  return title.replace(/^Template:/, '');
}

function formatPageTemplateTitles(response) {
  assert.ok(response.pages, errors.emptyResponse);
  const pages = Object.values(response.pages);
  assert.ok(pages.length === 1);
  const { templates = [] } = pages[0];
  return templates.map(normalizeTemplateTitle);
}

async function getPageTemplates({ client, title, wikiUrl }) {
  const params = { tlnamespace: 10, tllimit: 500 };
  const response = await client.getResultsFromApi([title], 'templates', wikiUrl, params);
  return formatPageTemplateTitles(response);
}

class Licences {
  constructor({ client, licenseStore }) {
    this.client = client;
    this.licenseStore = licenseStore;
  }

  async getLicense({ title, wikiUrl }) {
    const { client } = this;
    const templates = await getPageTemplates({ client, title, wikiUrl });
    return this.licenseStore.match(templates);
  }
}

module.exports = Licences;
