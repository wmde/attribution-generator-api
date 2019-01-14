const assert = require('assert');

function normalizeTemplateTitle(template) {
  const { title } = template;
  return title.replace(/^Template:/, '');
}

function formatPageTemplateTitles(response) {
  const { pages } = response;
  assert.ok(pages, 'notFound');
  const { templates = [] } = Object.values(pages)[0];
  return templates.map(normalizeTemplateTitle);
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

  // TODO: add separate tests for this or indicated the method as private
  async getPageTemplates({ title, wikiUrl }) {
    const params = { tlnamespace: 10, tllimit: 100 };
    const response = await this.client.getResultsFromApi(title, 'templates', wikiUrl, params);
    return formatPageTemplateTitles(response);
  }
}

module.exports = Licences;
