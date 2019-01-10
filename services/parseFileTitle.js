const assert = require('assert');

const FetchOriginalFileData = require('./fetchOriginalFileData');

const defaultWikiUrl = 'https://commons.wikimedia.org';
const filePrefix = 'File:';

class ParseFileTitle {
  constructor() {
    this.fetchOriginalFileData = new FetchOriginalFileData();
  }

  enhanceFileIdentifier(title) {
    assert.ok(title.startsWith(filePrefix), 'badData');
    return this.fetchOriginalFileData.getFileData({ title, wikiUrl: defaultWikiUrl });
  }
}

module.exports = ParseFileTitle;
