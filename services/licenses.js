const assert = require('assert');

const WikiClient = require('./wikiClient');
const LicenseStore = require('./licenseStore');
const licenses = require('../config/licenses/licenses');
const portReferences = require('../config/licenses/portReferences');
const parseWikiUrl = require('./parseWikiUrl');

function formatImageInfo(response) {
  const { pages } = response;
  const { imageinfo } = Object.values(pages)[0];
  return imageinfo[0];
}

function normalizeTemplate(template) {
  const { title } = template;
  return title.replace(/^Template:/, '');
}

function formatPageTemplates(response) {
  const { pages } = response;
  assert.ok(!!pages, 'tbd');
  const { templates } = Object.values(pages)[0];
  // TODO: handle case of no templates at all
  // 404?
  return templates.map(normalizeTemplate);
}

class Lisences {
  constructor() {
    this.client = new WikiClient();
    this.licenseStore = new LicenseStore(licenses, portReferences);
  }

  async getLicenseForFile(titleOrUrl) {
    const parsedUrl = parseWikiUrl(titleOrUrl);
    // this would be either BadRequest (400) or NotFound (404)...
    // e.g. 400 not a valid file url (second param to ok must be error or string message...)
    assert.ok(parsedUrl, 'badRequest');

    const { title, wikiUrl } = parsedUrl;

    // get actual url
    const { url: fileUrl } = await this.getImageInfo(title, wikiUrl);
    const { title: prefixedTitle, wikiUrl: fileWikiUrl } = parseWikiUrl(fileUrl);

    const templates = await this.getPageTemplates(prefixedTitle, fileWikiUrl);

    // find a matching license for the templates
    return this.licenseStore.match(templates);
  }

  async getImageInfo(title, wikiUrl) {
    const params = { iiprop: 'url', iilimit: 1, iiurlheight: 300 };
    const response = await this.client.getResultsFromApi(title, 'imageinfo', wikiUrl, params);
    return formatImageInfo(response);
  }

  // TODO: move this into own module once we have more business
  // logic in this module here.
  async getPageTemplates(title, wikiUrl) {
    const params = { tlnamespace: 10, tllimit: 100 };
    const response = await this.client.getResultsFromApi(title, 'templates', wikiUrl, params);
    return formatPageTemplates(response);
  }
}

module.exports = Lisences;
