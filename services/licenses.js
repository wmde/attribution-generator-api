const assert = require('assert');

function normalizeTemplate(template) {
  const { title } = template;
  return title.replace(/^Template:/, '');
}

function formatPageTemplates(response) {
  const { pages } = response;
  assert.ok(pages, 'notFound');
  const { templates = [] } = Object.values(pages)[0];
  return templates.map(normalizeTemplate);
}

class Licences {
  constructor({ client, licenseStore }) {
    this.client = client;
    this.licenseStore = licenseStore;
  }

  async getLicense({ title, wikiUrl }) {
    const templates = await this.getPageTemplates({ title, wikiUrl });
    return this.licenseStore.match(templates);
  }

  async getPageTemplates({ title, wikiUrl }) {
    const params = { tlnamespace: 10, tllimit: 100 };
    const response = await this.client.getResultsFromApi(title, 'templates', wikiUrl, params);
    return formatPageTemplates(response);
  }
}

module.exports = Licences;
