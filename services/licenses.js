const assert = require('assert');

const WikiClient = require('./wikiClient');
const LicenseStore = require('./licenseStore');
const licenses = require('../config/licenses/licenses');
const portReferences = require('../config/licenses/portReferences');


class Lisences {
  constructor() {
    this.client = new WikiClient();
    this.licenseStore = new LicenseStore(licenses, portReferences);
  }

  async getLicenseForFile(titleOrUrl) {
    // TODO: parse URL
    // prefix filename with "File:"
    // retrieve templates from api
    // match templates
  };

  // TODO: move this into own module once we have more business
  // logic in this module here.
  async getPageTemplates(title, wikiUrl) {
    const params = { tlnamespace: 10, tllimit: 100 };
    const response = await this.client.getResultsFromApi(title, 'templates', wikiUrl, params);
    return this.formatPageTemplates(response);
  }

  formatPageTemplates(response) {
    const { pages } = response;
    assert.ok(!!pages, 'tbd');
    const { templates } = Object.values(pages)[0];
    // TODO: handle case of no templates at all
    // 404?

    // strip the Template: part away from the template string
    const names = templates.map(template => {
      const { title } = template;
      return title.replace(/^Template:/, '');
    });

    // find a license for the templates
    const license = this.licenseStore.match(names);
    return license;
  }
}

module.exports = Lisences;
