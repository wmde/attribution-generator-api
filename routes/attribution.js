const Joi = require('joi');

const definitions = require('./__swagger__/definitions');
const prefix = require('./__utils__/path')('/attribution');

const routes = [];

const attributionMock = {
  license: 'CC BY-SA 3.0',
  attribution_plain:
    'Pierre Dalous (https://commons.wikimedia.org/wiki/File:Pair_of_Merops_apiaster_feeding.jpg), "Pair of Merops apiaster feeding", https://creativecommons.org/licenses/by-sa/3.0/legalcode',
  attribution_text:
    'Pierre Dalous (https://commons.wikimedia.org/wiki/File:Pair_of_Merops_apiaster_feeding.jpg), "Pair of Merops apiaster feeding", https://creativecommons.org/licenses/by-sa/3.0/legalcode',
  attribution_html:
    'Pierre Dalous (https://commons.wikimedia.org/wiki/File:Pair_of_Merops_apiaster_feeding.jpg), "Pair of Merops apiaster feeding", https://creativecommons.org/licenses/by-sa/3.0/legalcode',
  license_url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
};
routes.push({
  path: prefix('/{language}/{file}'),
  method: 'GET',
  options: {
    description: 'Generate attribution',
    notes: 'Generate attribution hints for the given file.',
    validate: {
      params: {
        language: Joi.string(),
        file: Joi.string(),
      },
    },
    response: {
      schema: Joi.object()
        .required()
        .meta({ className: 'AttributionShowResponse' }),
      status: {
        400: definitions.errors['400'],
      },
    },
    plugins: {
      'hapi-swaggered': {
        operationId: 'attribution.show',
        security: [{ default: [] }],
      },
    },
  },
  handler: async (request, h) => h.response(attributionMock),
});

module.exports = routes;
