const Joi = require('joi');

const { license: serialize } = require('../services/util/serializers');

const routes = [];

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

module.exports = routes;
