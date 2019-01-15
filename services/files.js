const assert = require('assert');

const parseWikiUrl = require('./util/parseWikiUrl');

async function getImageTitles({ client, title, wikiUrl }) {
  const { pages } = await client.getResultsFromApi(title, 'images', wikiUrl);
  assert.ok(pages, 'empty-response');
  const { images = [] } = Object.values(pages)[0];

  return images.map(image => image.title);
}

function formatImageInfo(page) {
  const { title, imageinfo } = page;
  const { url } = imageinfo[0];

  return { title, url };
}

async function getImageUrls({ client, titles, wikiUrl }) {
  const params = { iiprop: 'url' };
  const title = titles.join('|');
  const { pages } = await client.getResultsFromApi(title, 'imageinfo', wikiUrl, params);
  assert.ok(pages, 'empty-response');

  return Object.values(pages).map(formatImageInfo);
}

class Files {
  constructor({ client }) {
    this.client = client;
  }

  async getPageImages(url) {
    const { title, wikiUrl } = parseWikiUrl(url);
    const { client } = this;
    const titles = await getImageTitles({ client, title, wikiUrl });
    if (titles.length === 0) return [];

    return getImageUrls({ client, titles, wikiUrl });
  }
}

module.exports = Files;
