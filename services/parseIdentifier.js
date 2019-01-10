const FetchOriginalFileData = require('./fetchOriginalFileData');
const ParseFileTitle = require('./parseFileTitle');
const parseWikiUrl = require('./parseWikiUrl');

const urlRegex = /^(https|http)?:\/\//;

class ParseIdentifier {
  constructor() {
    this.fetchOriginalFileData = new FetchOriginalFileData();
    this.parseFileTitle = new ParseFileTitle();
  }

  getFileData(titleOrUrl) {
    const identifier = decodeURIComponent(titleOrUrl);
    if (urlRegex.test(identifier)) {
      const { title, wikiUrl } = parseWikiUrl(identifier);
      return this.fetchOriginalFileData.getFileData({ title, wikiUrl });
    }
    return this.parseFileTitle.enhanceFileIdentifier(identifier);
  }
}

module.exports = ParseIdentifier;
