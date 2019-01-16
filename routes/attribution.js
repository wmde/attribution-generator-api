const Joi = require('joi');

const definitions = require('./__swagger__/definitions');
const prefix = require('./__utils__/path')('/attribution');

const routes = [];

// function handleError({ message }) {
//   switch (message) {
//     case 'notFound':
//       throw new Boom(message, { statusCode: 404 });
//     case 'badData':
//       throw new Boom(message, { statusCode: 422 });
//     default:
//       throw new Boom(message);
//   }
// }

routes.push({
  path: prefix('/{languageCode}/{file}/{typeOfUse}/unmodified'),
  method: 'GET',
  options: {
    description: 'Generate attribution',
    notes: 'Generate attribution hints for the given file.',
    validate: {
      params: {
        languageCode: Joi.string(),
        file: Joi.string(),
        typeOfUse: Joi.string(),
      },
    },
    response: {
      schema: Joi.object()
        .required()
        .meta({ className: 'AttributionShowResponse' }),
      status: {
        400: definitions.errors['400'],
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
    const { fileData, licenses, attributionGenerator } = request.server.app.services;
    const { languageCode, file, typeOfUse } = request.params;
    try {
      const fileInfo = await fileData.getFileData(file);
      // TODO: get rid of this step by either specifying wrapper objects or just a common interface
      // We probably want to do all of this in the attributionGeerator service at least
      const { rawUrl: fileUrl, title: fileTitle } = fileInfo;
      const isEdited = false;

      const license = await licenses.getLicense(fileInfo);
      const attributionParams = { isEdited, license, languageCode, typeOfUse, fileUrl, fileTitle, ...fileInfo };
      const response = attributionGenerator.generateAttribution(attributionParams);
      return h.response(response);
    } catch (error) {
      // return handleError(error);
    }
  },
});

module.exports = routes;
