const assert = require('assert');

const WikiClient = require('./wikiClient');
const LicenseStore = require('./licenseStore');
const licenses = require('../config/licenses/licenses');
const portReferences = require('../config/licenses/portReferences');
const parseWikiUrl = require('./parseWikiUrl');

class Lisences {
  constructor() {
    this.client = new WikiClient();
    this.licenseStore = new LicenseStore(licenses, portReferences);
  }

  async getLicenseForFile(titleOrUrl) {
    // TODO: handle case of parsing retuning null
    const { title, wikiUrl } = parseWikiUrl(titleOrUrl);

    // get actual url
    const { url } = await this.getImageInfo(title, wikiUrl);
    const { title: prefixedTitle, wikiUrl: fileWikiUrl } = parseWikiUrl(url);

    const templates = await this.getPageTemplates(prefixedTitle, fileWikiUrl);

    // find a matching license for the templates
    return this.licenseStore.match(templates);
  }

  async getImageInfo(title, wikiUrl) {
    const params = { iiprop: 'url', iilimit: 1, iiurlheight: 300 };
    const response = await this.client.getResultsFromApi(title, 'imageinfo', wikiUrl, params);
    return this.formatImageInfo(response);
  }

  formatImageInfo(response) {
    const { pages } = response;
    const { imageinfo } = Object.values(pages)[0];
    return imageinfo[0];
  }

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
    return templates.map(template => {
      const { title } = template;
      return title.replace(/^Template:/, '');
    });
  }
}

module.exports = Lisences;
