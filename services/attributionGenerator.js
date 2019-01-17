const assert = require('assert');

const Attribution = require('../models/attribution');

class AttributionGenerator {
  constructor(attributionParams) {
    this.attributionParams = attributionParams;
  }

  generateAttribution() {
    const attribution = new Attribution(this.attributionParams);
    assert.ok(attribution);

    const { id: licenseId, url: licenseUrl } = attribution.license;
    const attributionHtml = attribution.html();
    const attributionPlain = attribution.plainText();

    return { licenseId, licenseUrl, attributionHtml, attributionPlain };
  }
}

module.exports = AttributionGenerator;
