const pkg = require('../package.json');

const config = {
  host: 'TODO',

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
  schemes: ['https', 'http'],

  // Security definitions
  securityDefinitions: [],

  // Configuration keys specific to "hapi-swaggered"
  requiredTags: [],
  auth: false,
};

module.exports = config;
