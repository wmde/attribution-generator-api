const Joi = require('joi');

const errors = require('../services/util/errors');
const definitions = require('./__swagger__/definitions');

const routes = [];

const fileSchema = Joi.object({
  title: Joi.string().required(),
  descriptionUrl: Joi.string()
    .uri()
    .required(),
  rawUrl: Joi.string()
    .uri()
    .required(),
  fileSize: Joi.number()
    .integer()
    .required(),
  thumbnail: Joi.object()
    .required()
    .keys({
      rawUrl: Joi.string()
        .uri()
        .required(),
      width: Joi.number()
        .integer()
        .required(),
      height: Joi.number()
        .integer()
        .required(),
    }),
});

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
    validate: {
      params: {
        articleUrl: Joi.string().uri(),
      },
    },
    response: {
      schema: Joi.array().items(fileSchema),
      status: {
        400: definitions.errors['400'],
        422: definitions.errors['422'],
        500: definitions.errors['500'],
        503: definitions.errors['503'],
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
