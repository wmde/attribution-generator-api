const assert = require('assert');

const parse = require('./parseWikiUrl');

function formatImagesInfoResponse(response) {
  const { pages } = response;
  assert.ok(!!pages, 'Wikimedia: No "url" option provided');

  // TODO: use response wrapper to extract data (ImageInfo)
  return Object.values(pages).map(page => {
    const { title, imageinfo } = page;
    const { url } = imageinfo[0];
    return { title, url };
  });
}

class Files {
  constructor({ client }) {
    this.client = client;
  }

  async getPageImages(url) {
    const { title, wikiUrl } = parse(url);
    const imageTitles = await this.getImageTitles(title, wikiUrl);

    return this.getImagesInfo(imageTitles, wikiUrl);
  }

  // TODO: handle no images found
  async getImageTitles(pageTitle, wikiUrl) {
    const response = await this.client.getResultsFromApi(pageTitle, 'images', wikiUrl);
    const page = Object.values(response.pages)[0];
    return page.images.map(image => image.title);
  }

  // TODO: what happens with too long titles (too many images)
  async getImagesInfo(images, wikiUrl) {
    const params = { iiprop: 'url' };
    const titles = images.join('|');
    const response = await this.client.getResultsFromApi(titles, 'imageinfo', wikiUrl, params);
    return formatImagesInfoResponse(response);
  }
}

module.exports = Files;
