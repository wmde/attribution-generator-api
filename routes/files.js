const Joi = require('joi');

const definitions = require('./__swagger__/definitions');
const prefix = require('./__utils__/path')('/files');

const routes = [];

const filesMock = [
  {
    file: 'Datei:Sunday 3 Besetzung (retouched).jpg',
    url: 'https://de.wikipedia.org/wiki/Datei:Sunday_3_Besetzung_(retouched).jpg',
  },
];

routes.push({
  path: prefix(''),
  method: 'GET',
  options: {
    description: 'Get all files for an article',
    notes: 'Retrieve all files for a given article or page url.',
    validate: {},
    response: {
      schema: Joi.array(),
      status: {
        400: definitions.errors['400'],
      },
    },
    plugins: {
      'hapi-swaggered': {
        operationId: 'files.index',
        security: [{ default: [] }],
      },
    },
  },
  handler: async (request, h) => h.response(filesMock),
});

module.exports = routes;
