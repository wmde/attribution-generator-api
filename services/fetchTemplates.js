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

class FetchTemplates {
  constructor({ client }) {
    this.client = client;
  }

  async getPageTemplates({ title, wikiUrl }) {
    const params = { tlnamespace: 10, tllimit: 100 };
    const response = await this.client.getResultsFromApi(title, 'templates', wikiUrl, params);
    return formatPageTemplates(response);
  }
}

module.exports = FetchTemplates;
