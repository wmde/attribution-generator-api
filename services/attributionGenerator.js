const assert = require('assert');

class AttributionGenerator {
  constructor() {
  }

  generateAttribution(params) {
    // assert.ok(params.fileUrl);
    // assert.ok(params.fileTitle);
    // assert.ok(params.typeOfUse);
    // assert.ok(params.languageCode);
    // assert.ok(params.artistHtml);
    // assert.ok(params.attributionHtml);
    // assert.ok(params.license);

    const attributionMock = {
      license: 'CC BY-SA 3.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
      attribution_plain:
      'Pierre Dalous (https://commons.wikimedia.org/wiki/File:Pair_of_Merops_apiaster_feeding.jpg), "Pair of Merops apiaster feeding", https://creativecommons.org/licenses/by-sa/3.0/legalcode',
      attribution_html:
      'Pierre Dalous (https://commons.wikimedia.org/wiki/File:Pair_of_Merops_apiaster_feeding.jpg), "Pair of Merops apiaster feeding", https://creativecommons.org/licenses/by-sa/3.0/legalcode',
    };

    return attributionMock;
  }
}

module.exports = AttributionGenerator;
