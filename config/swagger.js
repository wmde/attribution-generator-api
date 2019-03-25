const pkg = require('../package.json');

const config = {
  host: process.env.API_DOCS_HOST,

  // Overall API description
  info: {
    description: pkg.description,
    title: pkg.name,
    version: pkg.version,
  },

  // Specify content types
  consumes: ['application/json'],
  produces: ['application/json'],

  // URI schemes
  schemes: ['http', 'https'],

  // Security definitions
  securityDefinitions: {},

  // Configuration keys specific to "hapi-swaggered"
  requiredTags: [],
  auth: false,
};

if (process.env.API_DOCS_BASE_PATH) {
  config.basePath = process.env.API_DOCS_BASE_PATH;
}

module.exports = config;
