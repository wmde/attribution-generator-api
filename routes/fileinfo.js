const Joi = require('joi');

const errors = require('../services/util/errors');
const definitions = require('./__swagger__/definitions');
const { fileinfo: serialize } = require('../services/util/serializers');

const routes = [];

const responseSchema = Joi.object({
  license: Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    url: Joi.string()
      .uri()
      .required(),
    groups: Joi.array()
      .required()
      .items(Joi.string()),
  }),
  author_html: Joi.string(),
  attribution_html: Joi.string(),
  media_type: Joi.string().required(),
});

function handleError(h, { message }) {
  switch (message) {
    case errors.invalidUrl:
      return h.error(message, { statusCode: 422 });
    case errors.emptyResponse:
      return h.error(message, { statusCode: 404 });
    case errors.apiUnavailabe:
      return h.error(message, { statusCode: 503 });
    default:
      return h.error(message);
  }
}

routes.push({
  path: '/fileinfo/{fileUrlOrTitle}',
  method: 'GET',
  options: {
    description: 'Image license',
    notes: 'Returns the most liberal license for the given image',
    validate: {
      params: {
        fileUrlOrTitle: Joi.string(),
      },
    },
    response: {
      schema: responseSchema,
      status: {
        404: definitions.errors['404'],
        422: definitions.errors['422'],
        500: definitions.errors['500'],
        503: definitions.errors['503'],
      },
    },
  },
  handler: async (request, h) => {
    const { fileData, licenses } = request.server.app.services;
    const { fileUrlOrTitle } = request.params;
    try {
      const fileInfo = await fileData.getFileData(fileUrlOrTitle);
      const getLicenseParams = { title: fileInfo.title, wikiUrl: fileInfo.wikiUrl };
      const license = await licenses.getLicense(getLicenseParams);
      const response = serialize(fileInfo, license);
      return h.response(response);
    } catch (error) {
      return handleError(h, error);
    }
  },
});

module.exports = routes;
