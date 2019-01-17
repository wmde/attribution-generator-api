const Joi = require('joi');
const assert = require('assert');

const { knownLanguages, knownTypesOfUse, Attribution } = require('../models/attribution');
const errors = require('../services/util/errors');
const definitions = require('./__swagger__/definitions');
const prefix = require('./__utils__/path')('/attribution');

const routes = [];

const attributionSchema = Joi.object()
  .required()
  .keys({
    attributionHtml: Joi.string().required(),
    attributionPlain: Joi.string().required(),
    licenseId: Joi.string().required(),
    licenseUrl: Joi.string()
      .uri()
      .required(),
  })
  .meta({ className: 'AttributionShowResponse' });

function handleError(h, { message }) {
  switch (message) {
    case errors.licenseNotFound:
      return h.error(message, { statusCode: 404 });
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
      schema: attributionSchema,
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

routes.push({
  path: prefix(
    '/{languageCode}/{file}/{typeOfUse}/modified/{modification}/{modificationAuthor}/{licenseId}'
  ),
  method: 'GET',
  options: {
    description: 'Generate attribution for a modifile work',
    notes: 'Generate attribution hints for the given file if that file was modified.',
    validate: {
      params: {
        languageCode: Joi.string().valid(knownLanguages),
        file: Joi.string(),
        typeOfUse: Joi.string().valid(knownTypesOfUse),
        modification: Joi.string(),
        modificationAuthor: Joi.string(),
        licenseId: Joi.string(),
      },
    },
    response: {
      schema: attributionSchema,
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
    const { fileData, licenseStore } = request.server.app.services;
    const {
      languageCode,
      file,
      typeOfUse,
      modification,
      modificationAuthor,
      licenseId,
    } = request.params;
    try {
      const fileInfo = await fileData.getFileData(file);
      const license = licenseStore.getLicenseById(licenseId);
      assert.ok(license, errors.licenseNotFound);

      const attribution = new Attribution({
        isEdited: true,
        license,
        languageCode,
        typeOfUse,
        fileInfo,
        modification,
        modificationAuthor,
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
