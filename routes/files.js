const Joi = require('joi');
const Boom = require('boom');

const definitions = require('./__swagger__/definitions');

const routes = [];

function handleError(error) {
  const { message } = error;
  if (message === 'invalid-url') {
    throw new Boom(error, { statusCode: 422 });
  } else {
    throw new Boom(error);
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
      return handleError(error);
    }
  },
});

module.exports = routes;
