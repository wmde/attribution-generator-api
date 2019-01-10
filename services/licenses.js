const ParseIdentifier = require('./parseIdentifier');
const RetrieveLicense = require('./retrieveLicense');

class Lisences {
  constructor() {
    this.parseIdentifier = new ParseIdentifier();
    this.retrieveLicense = new RetrieveLicense();
  }

  async getLicense(titleOrUrl) {
    const { title, wikiUrl } = await this.parseIdentifier.getFileData(titleOrUrl);
    return this.retrieveLicense.getLicenseForFile({ title, wikiUrl });
  }
}

module.exports = Lisences;
