const assert = require('assert');
const axios = require('axios');

const client = require('./wikiClient');

function formatImagesInfoResponse(response) {
  const pages = response.pages;
  assert.ok(!!pages, 'Wikimedia: No "url" option provided')

  // TODO: use response wrapper to extract data (ImageInfo)
  return Object.values(pages).map(page => {
    const { title, imageinfo } = page;
    const url = imageinfo[0].url;
    return { title, url };
  });
}

class Files {
  async getPageImages(pageTitle, wikiUrl) {
    const imageTitles = await this.getImageTitles(pageTitle, wikiUrl);

    return await this.getImagesInfo(imageTitles, wikiUrl);
  }

  // TODO: handle no images found
  async getImageTitles(pageTitle, wikiUrl) {
    const params = { titles: pageTitle };
    const response = await client.getResultsFromApi(pageTitle, 'images', wikiUrl, params);
    const page = Object.values(response.pages)[0];
    return page.images.map(image => image.title);
  }

  // TODO: what happens with too long titles (too many images)
  async getImagesInfo(images, wikiUrl) {
    const params = { iiprop: 'url' };
    const titles = images.join('|');
    const response = await client.getResultsFromApi(titles, 'imageinfo', wikiUrl, params);
    return formatImagesInfoResponse(response);
  }
}

module.exports = Files;
