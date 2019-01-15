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

async function getImageInfo({ client, title, wikiUrl }) {
  const params = { iiprop: 'url|extmetadata', iilimit: 1, iiurlheight: 300 };
  const response = await client.getResultsFromApi(title, 'imageinfo', wikiUrl, params);
  return parseImageInfoResponse(response);
}

async function getOriginalFileData({ client, ...params }) {
  const imageInfo = await getImageInfo({ client, ...params });
  const { url, extmetadata } = imageInfo;
  const { title, wikiUrl } = parseWikiUrl(url);
  const { value: artistHtml = null } = extmetadata.Artist || {};

  return { title, wikiUrl, artistHtml };
}

class FileData {
  constructor({ client }) {
    this.client = client;
  }

  async getFileData(titleOrUrl) {
    const identifier = decodeURIComponent(titleOrUrl);
    const { title, wikiUrl } = parseIdentifier(identifier);
    const { client } = this;

    return getOriginalFileData({ client, title, wikiUrl });
  }
}

module.exports = FileData;
