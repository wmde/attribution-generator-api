const Joi = require('joi');

const definitions = require('./__swagger__/definitions');

const routes = [];

routes.push({
  path: '/files/{pageUrl}',
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
    const response = await files.getPageImages(request.params.pageUrl);
    return h.response(response);
  },
});

module.exports = routes;
