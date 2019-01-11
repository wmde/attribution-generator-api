const FetchOriginalFileData = require('./fetchOriginalFileData');
const ParseFileTitle = require('./parseFileTitle');
const parseWikiUrl = require('./util/parseWikiUrl');

const urlRegex = /^(https|http)?:\/\//;

class ParseIdentifier {
  constructor({ client }) {
    this.fetchOriginalFileData = new FetchOriginalFileData({ client });
    this.parseFileTitle = new ParseFileTitle({ client });
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
