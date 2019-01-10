const assert = require('assert');

const WikiClient = require('./wikiClient');

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
  constructor() {
    this.client = new WikiClient();
  }

  async getPageTemplates({ title, wikiUrl }) {
    const params = { tlnamespace: 10, tllimit: 100 };
    const response = await this.client.getResultsFromApi(title, 'templates', wikiUrl, params);
    return formatPageTemplates(response);
  }
}

module.exports = FetchTemplates;
