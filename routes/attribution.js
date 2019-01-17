const Joi = require('joi');

const { knownLanguages, knownTypesOfUse, Attribution } = require('../models/attribution');
const errors = require('../services/util/errors');
const definitions = require('./__swagger__/definitions');
const prefix = require('./__utils__/path')('/attribution');

const routes = [];

function handleError(h, { message }) {
  switch (message) {
    case errors.invalidUrl:
    case errors.validationError:
      return h.error(message, { statusCode: 422 });
    case errors.apiUnavailabe:
      return h.error(message, { statusCode: 503 });
    default:
      return h.error(message);
  }
}

routes.push({
  path: prefix('/{languageCode}/{file}/{typeOfUse}/unmodified'),
  method: 'GET',
  options: {
    description: 'Generate attribution',
    notes: 'Generate attribution hints for the given file.',
    validate: {
      params: {
        languageCode: Joi.string().valid(knownLanguages),
        file: Joi.string(),
        typeOfUse: Joi.string().valid(knownTypesOfUse),
      },
    },
    response: {
      schema: Joi.object()
        .required()
        .meta({ className: 'AttributionShowResponse' }),
      status: {
        400: definitions.errors['400'],
        422: definitions.errors['422'],
        500: definitions.errors['500'],
        503: definitions.errors['503'],
      },
    },
    plugins: {
      'hapi-swaggered': {
        operationId: 'attribution.show',
        security: [{ default: [] }],
      },
    },
  },
  handler: async (request, h) => {
    const { fileData, licenses } = request.server.app.services;
    const { languageCode, file, typeOfUse } = request.params;
    try {
      const fileInfo = await fileData.getFileData(file);
      const license = await licenses.getLicense(fileInfo);
      const attribution = new Attribution({
        isEdited: false,
        license,
        languageCode,
        typeOfUse,
        fileInfo,
      });
      return h.response({
        licenseId: license.id,
        licenseUrl: license.url,
        attributionHtml: attribution.html(),
        attributionPlain: attribution.plainText(),
      });
    } catch (error) {
      return handleError(h, error);
    }
  },
});

module.exports = routes;
