// Hapi & friends
const Hapi = require('hapi');
const HapiRouter = require('hapi-router');
const HapiSwagger = require('hapi-swaggered');
const HapiSwaggerUi = require('hapi-swaggered-ui');

const Good = require('good');
const Boom = require('boom');
const Inert = require('inert');
const Vision = require('vision');

async function init(environment) {
  const { logging, secret, server: options, services, swagger } = environment;

  // Create a server instance.
  const server = Hapi.server(options);

  // Extend app context.
  server.app.secret = secret;
  server.app.services = services;

  // Extend Hapi response toolkit and request interfaces.
  server.decorate('toolkit', 'error', (message, ...args) => {
    throw new Boom(message, ...args);
  });

  server.decorate('toolkit', 'assert', function assert(value, err, ...args) {
    if (!value) this.error(err, ...args);
  });

  // Register logging plugin.
  if (logging) {
    await server.register([
      {
        plugin: Good,
        options: logging,
      },
    ]);
  }

  // Register router & swagger plugins.
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwaggerUi,
      options: {
        title: 'Lizenzgenerator API',
        path: '/docs',
      },
    },
    {
      plugin: HapiRouter,
      options: {
        routes: 'routes/*.js',
        ignore: ['routes/*.test.js'],
        cwd: __dirname,
      },
    },
    {
      plugin: HapiSwagger,
      options: swagger,
    },
  ]);

  // Prepare for server start.
  await server.initialize();

  return server;
}

module.exports = init;
