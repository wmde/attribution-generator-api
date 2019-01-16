const Joi = require('joi');

const errors = require('../services/util/errors');
const definitions = require('./__swagger__/definitions');

const routes = [];

function handleError(h, { message }) {
  switch (message) {
    case errors.invalidUrl:
      return h.error(message, { statusCode: 422 });
    case errors.apiUnavailabe:
      return h.error(message, { statusCode: 503 });
    default:
      return h.error(message);
  }
}

routes.push({
  path: '/files/{articleUrl}',
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
  handler: async (request, h) => {
    const { files } = request.server.app.services;
    const { articleUrl } = request.params;
    try {
      const response = await files.getPageImages(articleUrl);
      return h.response(response);
    } catch (error) {
      return handleError(h, error);
    }
  },
});

module.exports = routes;
