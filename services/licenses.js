const ParseIdentifier = require('./parseIdentifier');
const RetrieveLicense = require('./retrieveLicense');

class Licences {
  constructor({ client }) {
    this.parseIdentifier = new ParseIdentifier({ client });
    this.retrieveLicense = new RetrieveLicense();
  }

  async getLicense(titleOrUrl) {
    const { title, wikiUrl } = await this.parseIdentifier.getFileData(titleOrUrl);
    return this.retrieveLicense.getLicenseForFile({ title, wikiUrl });
  }
}

module.exports = Licences;
