const Joi = require('joi');

const pkg = require('../package.json');

const prefix = require('./__utils__/path')('/info');

const routes = [];

routes.push({
  path: prefix(''),
  method: 'GET',
  options: {
    auth: false,
    description: 'Get information',
    notes: 'Get information on the API.',
    validate: {},
    response: {
      schema: Joi.object({
        version: Joi.string()
          .required()
          .example('1.0.0'),
      })
        .required()
        .meta({ className: 'InfoShowResponse' }),
    },
    plugins: {
      'hapi-swaggered': {
        operationId: 'info.show',
      },
    },
  },
  handler: async (request, h) => {
    const { tracker } = request.server.app;
    const { version } = pkg;
    tracker.track(request, 'API Info');
    return h.response({ version });
  },
});

module.exports = routes;
