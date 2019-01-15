const assert = require('assert');

function normalizeTemplateTitle(template) {
  const { title } = template;
  return title.replace(/^Template:/, '');
}

function formatPageTemplateTitles(response) {
  const { pages } = response;
  assert.ok(pages, 'empty-response');
  const { templates = [] } = Object.values(pages)[0];
  return templates.map(normalizeTemplateTitle);
}

async function getPageTemplates({ client, title, wikiUrl }) {
  const params = { tlnamespace: 10, tllimit: 100 };
  const response = await client.getResultsFromApi(title, 'templates', wikiUrl, params);
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
