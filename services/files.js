const assert = require('assert');
const axios = require('axios');

const WikiClient = require('./wikiClient');
const WikiUrlParser = require('./wikiUrlParser');

function formatImagesInfoResponse(response) {
  const pages = response.pages;
  assert.ok(!!pages, 'Wikimedia: No "url" option provided');

  // TODO: use response wrapper to extract data (ImageInfo)
  return Object.values(pages).map(page => {
    const { title, imageinfo } = page;
    const url = imageinfo[0].url;
    return { title, url };
  });
}

class Files {
  constructor() {
    this.client = new WikiClient();
    this.parser = new WikiUrlParser();
  }

  async getPageImages(url) {
    const { title, wikiUrl } = await this.parser.parse(url);
    const imageTitles = await this.getImageTitles(title, wikiUrl);

    return await this.getImagesInfo(imageTitles, wikiUrl);
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
