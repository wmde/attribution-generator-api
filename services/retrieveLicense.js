const LicenseStore = require('./licenseStore');
const licenses = require('../config/licenses/licenses');
const portReferences = require('../config/licenses/portReferences');
const FetchTemplates = require('./fetchTemplates');

// TODO: does this even need to be a class?
class RetrieveLicense {
  constructor() {
    this.licenseStore = new LicenseStore(licenses, portReferences);
    // TODO: we would prefer to only have a single instance of each service
    this.fetchTemplates = new FetchTemplates();
  }

  async getLicenseForFile({ title, wikiUrl }) {
    const templates = await this.fetchTemplates.getPageTemplates({ title, wikiUrl });
    return this.licenseStore.match(templates);
  }
}

module.exports = RetrieveLicense;
