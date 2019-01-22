function normalizeTemplateTitle(template) {
  const { title } = template;
  return title.replace(/^Template:/, '');
}

function formatPageTemplateTitles(pages) {
  return Object.values(pages).reduce((acc, page) => {
    const { templates = [] } = page;
    return [...acc, ...templates.map(normalizeTemplateTitle)];
  }, []);
}

async function getPageTemplates({ client, title, wikiUrl }) {
  const params = { tlnamespace: 10, tllimit: 500 };
  const { pages } = await client.getResultsFromApi([title], 'templates', wikiUrl, params);
  return formatPageTemplateTitles(pages);
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
