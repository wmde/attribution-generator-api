const WikiClient = require('./wikiClient');
const parseWikiUrl = require('./parseWikiUrl');

function parseImageInfoResponse(response) {
  const { pages } = response;
  // TODO: assert that pages are present, otherwise 404
  const { imageinfo } = Object.values(pages)[0];
  return imageinfo[0];
}

class FetchOriginalFileData {
  constructor() {
    this.client = new WikiClient();
  }

  async getFileData(params) {
    const imageInfo = await this.getImageInfo(params);
    // TODO: 404 if no imageInfor
    const { url, extmetadata } = imageInfo;
    const { title, wikiUrl } = parseWikiUrl(url);
    // TODO: 404 if not parseable
    const { value: artistHtml } = extmetadata.Artist;
    return { title, wikiUrl, artistHtml };
  }

  async getImageInfo({ title, wikiUrl }) {
    const params = { iiprop: 'url|extmetadata', iilimit: 1, iiurlheight: 300 };
    const response = await this.client.getResultsFromApi(title, 'imageinfo', wikiUrl, params);
    return parseImageInfoResponse(response);
  }
}

module.exports = FetchOriginalFileData;
