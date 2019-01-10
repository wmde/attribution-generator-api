const assert = require('assert');

const WikiClient = require('./wikiClient');
const parseWikiUrl = require('./parseWikiUrl');

function parseImageInfoResponse(response) {
  const { pages } = response;
  assert.ok(pages, 'notFound');
  const { imageinfo } = Object.values(pages)[0];
  return imageinfo[0];
}

class FetchOriginalFileData {
  constructor() {
    this.client = new WikiClient();
  }

  async getFileData(params) {
    const imageInfo = await this.getImageInfo(params);
    const { url, extmetadata } = imageInfo;
    const { title, wikiUrl } = parseWikiUrl(url);
    const { value: artistHtml = null } = extmetadata.Artist || {};
    return { title, wikiUrl, artistHtml };
  }

  async getImageInfo({ title, wikiUrl }) {
    const params = { iiprop: 'url|extmetadata', iilimit: 1, iiurlheight: 300 };
    const response = await this.client.getResultsFromApi(title, 'imageinfo', wikiUrl, params);
    return parseImageInfoResponse(response);
  }
}

module.exports = FetchOriginalFileData;
