const assert = require('assert');

const parseWikiUrl = require('./util/parseWikiUrl');

function formatImageInfo(page) {
  const { title, imageinfo } = page;
  const { url } = imageinfo[0];
  return { title, url };
}

function parseImageInfoResponse(response) {
  const { pages } = response;
  assert.ok(!!pages, 'Wikimedia: No "url" option provided');

  // TODO: raise error when length === 1
  return Object.values(pages).map(formatImageInfo);
}

class Files {
  constructor({ client }) {
    this.client = client;
  }

  async getPageImages(url) {
    const { title, wikiUrl } = parseWikiUrl(url);
    const titles = await this.getImageTitles({ title, wikiUrl });

    return this.getImageUrls({ titles, wikiUrl });
  }

  // TODO: handle no images found
  async getImageTitles({ title, wikiUrl }) {
    const response = await this.client.getResultsFromApi(title, 'images', wikiUrl);
    const page = Object.values(response.pages)[0];
    return page.images.map(image => image.title);
  }

  // TODO: what happens with too long titles (too many images)
  async getImageUrls({ titles, wikiUrl }) {
    const params = { iiprop: 'url' };
    const title = titles.join('|');
    const response = await this.client.getResultsFromApi(title, 'imageinfo', wikiUrl, params);
    return parseImageInfoResponse(response);
  }
}

module.exports = Files;
