const assert = require('assert');

const parseWikiUrl = require('./util/parseWikiUrl');
const errors = require('./util/errors');

const fileRegex = /^\w+:([^\/]+\.\w+)$/;
const defaultWikiUrl = 'https://commons.wikimedia.org/';

function parseImageInfoResponse(response) {
  assert.ok(response.pages, errors.emptyResponse);
  const pages = Object.values(response.pages);
  const { to: normalizedTitle } = response.normalized ? response.normalized[0] : {};
  assert.ok(pages.length === 1);
  const { imageinfo } = pages[0];
  return {
    normalizedTitle,
    ...imageinfo[0],
  };
}

function parseFileTitle(title) {
  const matches = title.match(fileRegex);
  return {
    title: `File:${matches[1]}`,
    wikiUrl: defaultWikiUrl
  };
}

function parseIdentifier(identifier) {
  if (fileRegex.test(identifier)) {
    return parseFileTitle(identifier);
  }
  return parseWikiUrl(identifier);
}

async function getImageInfo({ client, title, wikiUrl }) {
  const params = { iiprop: 'url|extmetadata|mediatype', iilimit: 1, iiurlheight: 300 };
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
    const { normalizedTitle, url, extmetadata, mediatype } = await getImageInfo({
      client,
      title,
      wikiUrl,
    });
    const { title: originalTitle, wikiUrl: originalWikiUrl } = parseWikiUrl(url);
    const { value: artistHtml = null } = extmetadata.Artist || {};
    const { value: attributionHtml = null } = extmetadata.Attribution || {};

    return {
      title: originalTitle,
      normalizedTitle: normalizedTitle || originalTitle,
      wikiUrl: originalWikiUrl,
      rawUrl: url,
      artistHtml,
      attributionHtml,
      mediaType: mediatype,
    };
  }
}

module.exports = FileData;
