const Joi = require('joi');

const routes = [];

const licenseSchema = Joi.object({
  url: Joi.string().uri(),
  code: Joi.string(),
});

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
    const { licenseStore } = request.server.app.services;
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
  handler: async (request, h) => {
    const { fileData, licenses } = request.server.app.services;
    const { file } = request.params;
    try {
      const { title, wikiUrl } = await fileData.getFileData(file);
      const license = await licenses.getLicense({ title, wikiUrl });
      const response = { url: encodeURI(license.url), code: license.name };
      return h.response(response);
    } catch (error) {
      const { message } = error;
      return h.error(message);
    }
  },
});

module.exports = routes;
