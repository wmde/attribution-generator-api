const assert = require('assert');

const parseWikiUrl = require('./util/parseWikiUrl');
const errors = require('./util/errors');

async function getImageTitles({ client, title, wikiUrl }) {
  const params = { imlimit: 500 };
  const { pages } = await client.getResultsFromApi([title], 'images', wikiUrl, params);
  return Object.values(pages).reduce((acc, page) => {
    const { images = [] } = page;
    return [...acc, ...images.map(image => image.title)];
  }, []);
}

function formatImageInfo(page) {
  const { title, imageinfo } = page;
  const {
    url: rawUrl,
    descriptionurl: descriptionUrl,
    size: fileSize,
    thumburl,
    thumbwidth,
    thumbheight,
  } = imageinfo[0];
  const thumbnail = { rawUrl: thumburl, width: thumbwidth, height: thumbheight };

  return { title, descriptionUrl, rawUrl, fileSize, thumbnail };
}

async function getImageUrls({ client, titles, wikiUrl }) {
  const params = { iiprop: 'url|size', iiurlwidth: 300 };
  const { pages } = await client.getResultsFromApi(titles, 'imageinfo', wikiUrl, params);
  assert.ok(pages, errors.emptyResponse);

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
