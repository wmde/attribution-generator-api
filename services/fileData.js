const assert = require('assert');

const parseWikiUrl = require('./util/parseWikiUrl');
const errors = require('./util/errors');

const urlRegex = /^(https|http)?:\/\//;
const filePrefix = 'File:';
const defaultWikiUrl = 'https://commons.wikimedia.org/';

function parseImageInfoResponse(response) {
  assert.ok(response.pages, errors.emptyResponse);
  const pages = Object.values(response.pages);
  assert.ok(pages.length === 1);
  const { imageinfo } = pages[0];
  return imageinfo[0];
}

function parseFileTitle(title) {
  assert.ok(title.startsWith(filePrefix), errors.invalidUrl);
  return { title, wikiUrl: defaultWikiUrl };
}

function parseIdentifier(identifier) {
  if (urlRegex.test(identifier)) {
    return parseWikiUrl(identifier);
  }
  return parseFileTitle(identifier);
}

async function getImageInfo({ client, title, wikiUrl }) {
  const params = { iiprop: 'url|extmetadata', iilimit: 1, iiurlheight: 300 };
  const response = await client.getResultsFromApi([title], 'imageinfo', wikiUrl, params);
  return parseImageInfoResponse(response);
}

class FileData {
  constructor({ client }) {
    this.client = client;
  }

  async getFileData(titleOrUrl) {
    const { client } = this;
    const identifier = decodeURIComponent(titleOrUrl);
    const { title, wikiUrl } = parseIdentifier(identifier);
    const { url, extmetadata } = await getImageInfo({ client, title, wikiUrl });
    const { title: originalTitle, wikiUrl: originalWikiUrl } = parseWikiUrl(url);
    const { value: artistHtml = null } = extmetadata.Artist || {};

    return { title: originalTitle, wikiUrl: originalWikiUrl, artistHtml };
  }
}

module.exports = FileData;
