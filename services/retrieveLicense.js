const FetchTemplates = require('./fetchTemplates');

// TODO: does this even need to be a class?
class RetrieveLicense {
  constructor({ client, licenseStore }) {
    this.licenseStore = licenseStore;
    // TODO: we would prefer to only have a single instance of each service
    this.fetchTemplates = new FetchTemplates({ client });
  }

  async getLicenseForFile({ title, wikiUrl }) {
    const templates = await this.fetchTemplates.getPageTemplates({ title, wikiUrl });
    return this.licenseStore.match(templates);
  }
}

module.exports = RetrieveLicense;
