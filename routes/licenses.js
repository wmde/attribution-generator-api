const Joi = require('joi');
const Boom = require('boom');

const errors = require('../services/util/errors');

const routes = [];

const licenseSchema = Joi.object({
  url: Joi.string().uri(),
  code: Joi.string(),
});

function handleError({ message }) {
  switch (message) {
    case errors.invalidUrl:
      throw new Boom(message, { statusCode: 422 });
    case errors.emptyResponse:
      throw new Boom(message, { statusCode: 404 });
    case errors.apiUnavailabe:
      throw new Boom(message, { statusCode: 503 });
    default:
      throw new Boom(message);
  }
}

routes.push({
  path: '/licenses/compatible/{license}',
  method: 'GET',
  options: {
    description: 'Compatible licenses',
    notes: 'Returns a list of licenses that are compatible to the passed license',
    validate: {
      params: {
        license: Joi.string(),
      },
    },
    response: {
      schema: Joi.array().items(licenseSchema),
    },
  },
  handler: async (request, h) => {
    const { licenseStore } = request.server.app.services;
    const param = decodeURIComponent(request.params.license).replace(/\+/g, ' ');
    const licenses = licenseStore.compatible(param);
    const response = licenses.map(({ url, name }) => ({ url: encodeURI(url), code: name }));
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
    const response = licenses.map(({ url, name }) => ({ url: encodeURI(url), code: name }));
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
      schema: Joi.object().keys({
        code: Joi.string(),
        url: Joi.string(),
      }),
    },
  },
  handler: async (request, h) => {
    const { fileData, licenses } = request.server.app.services;
    const { fileUrlOrTitle } = request.params;
    try {
      const { title, wikiUrl } = await fileData.getFileData(fileUrlOrTitle);
      const license = await licenses.getLicense({ title, wikiUrl });
      const response = { url: encodeURI(license.url), code: license.name };
      return h.response(response);
    } catch (error) {
      return handleError(error);
    }
  },
});

module.exports = routes;
