const assert = require('assert');

const parseWikiUrl = require('./util/parseWikiUrl');

const urlRegex = /^(https|http)?:\/\//;
const filePrefix = 'File:';
const defaultWikiUrl = 'https://commons.wikimedia.org/';

function parseImageInfoResponse(response) {
  const { pages } = response;
  assert.ok(pages, 'notFound');
  const { imageinfo } = Object.values(pages)[0];
  return imageinfo[0];
}

function parseFileTitle(title) {
  assert.ok(title.startsWith(filePrefix), 'badData');
  return { title, wikiUrl: defaultWikiUrl };
}

function parseIdentifier(identifier) {
  if (urlRegex.test(identifier)) {
    return parseWikiUrl(identifier);
  }
  return parseFileTitle(identifier);
}

class FileData {
  constructor({ client }) {
    this.client = client;
  }

  async getFileData(titleOrUrl) {
    const identifier = decodeURIComponent(titleOrUrl);
    const { title, wikiUrl } = parseIdentifier(identifier);
    return this.getOriginalFileData({ title, wikiUrl });
  }

  // TODO: add separate tests for this or indicated the method as private
  async getOriginalFileData(params) {
    const imageInfo = await this.getImageInfo(params);
    const { url, extmetadata } = imageInfo;
    const { title, wikiUrl } = parseWikiUrl(url);
    const { value: artistHtml = null } = extmetadata.Artist || {};
    return { title, wikiUrl, artistHtml };
  }

  // TODO: add separate tests for this or indicated the method as private
  async getImageInfo({ title, wikiUrl }) {
    const params = { iiprop: 'url|extmetadata', iilimit: 1, iiurlheight: 300 };
    const response = await this.client.getResultsFromApi(title, 'imageinfo', wikiUrl, params);
    return parseImageInfoResponse(response);
  }
}

module.exports = FileData;
