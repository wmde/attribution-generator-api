const pkg = require('../package.json');

const config = {
  host: 'localhost:8080',

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

if (process.env.DOCS_BASE_PATH) {
  config.basePath = process.env.DOCS_BASE_PATH;
}

module.exports = config;
