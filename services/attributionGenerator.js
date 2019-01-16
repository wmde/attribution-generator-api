const assert = require('assert');

const Attribution = require('../models/attribution');

class AttributionGenerator {
  // TODO: think about doing some validations and data wrangling here
  generateAttribution(params) {
    const attribution = new Attribution(params);
    assert.ok(attribution);
    const { license } = attribution;
    const { id: licenseId, url: licenseUrl } = license;
    const attributionHtml = attribution.html();
    const attributionPlain = attribution.plainText();

    return { licenseId, licenseUrl, attributionHtml, attributionPlain }
  }
}

module.exports = AttributionGenerator;
