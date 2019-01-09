const Joi = require('joi');

const routes = [];

const licenseSchema = Joi.object({
  url: Joi.string().uri(),
  code: Joi.string(),
});

const mockResponse = [
  {
    code: 'CC BY-SA 3.0',
    url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
  },
];

routes.push({
  path: '/licenses/compatible/{license}',
  method: 'GET',
  options: {
    description: 'Compatible licenses',
    notes: 'Returns a list of licenses that are compatible to the passed license',
    validate: {},
    response: {
      schema: Joi.array().items(licenseSchema),
    },
  },
  handler: async (request, h) => {
    const licenseStore = request.server.app.services.licenses;
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
    const licenseStore = request.server.app.services.licenses;
    const licenses = licenseStore.all();
    const response = licenses.map(({ url, name }) => ({ url: encodeURI(url), code: name }));
    return h.response(response);
  },
});

routes.push({
  path: '/license/{file}',
  method: 'GET',
  options: {
    description: 'Image license',
    notes: 'Returns the most liberal license for the given image',
    validate: {
      params: {
        file: Joi.string(),
      },
    },
    response: {
      schema: Joi.object().keys({
        code: Joi.string(),
        url: Joi.string(),
      }),
    },
  },
  handler: async (request, h) => h.response(mockResponse[0]),
});

module.exports = routes;
