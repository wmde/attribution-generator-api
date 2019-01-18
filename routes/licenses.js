const Joi = require('joi');

const errors = require('../services/util/errors');

const routes = [];

function serialize(license) {
  const { id: code, name, url, groups } = license;
  return { code, name, url, groups };
}

const licenseSchema = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  url: Joi.string()
    .uri()
    .required(),
  groups: Joi.array()
    .required()
    .items(Joi.string()),
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
  path: '/licenses/compatible/{licenseId}',
  method: 'GET',
  options: {
    description: 'Compatible licenses',
    notes: 'Returns a list of licenses that are compatible to the passed license ID',
    validate: {
      params: {
        licenseId: Joi.string(),
      },
    },
    response: {
      schema: Joi.array().items(licenseSchema),
    },
  },
  handler: async (request, h) => {
    const { licenseStore } = request.server.app.services;
    const { licenseId } = request.params;
    const licenses = licenseStore.compatible(licenseId);
    const response = licenses.map(serialize);
    return h.response(response);
  },
});

routes.push({
  path: '/licenses',
  method: 'GET',
  options: {
    description: 'Licenses index',
    notes: 'Returns a list of all licenses',
    validate: {},
    response: {
      schema: Joi.array().items(licenseSchema),
    },
  },
  handler: async (request, h) => {
    const { licenseStore } = request.server.app.services;
    const licenses = licenseStore.all();
    const response = licenses.map(serialize);
    return h.response(response);
  },
});

routes.push({
  path: '/license/{fileUrlOrTitle}',
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
      schema: licenseSchema,
    },
  },
  handler: async (request, h) => {
    const { fileData, licenses } = request.server.app.services;
    const { fileUrlOrTitle } = request.params;
    try {
      const { title, wikiUrl } = await fileData.getFileData(fileUrlOrTitle);
      const license = await licenses.getLicense({ title, wikiUrl });
      const response = serialize(license);
      return h.response(response);
    } catch (error) {
      return handleError(h, error);
    }
  },
});

module.exports = routes;
