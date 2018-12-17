// Initialize the environment
require('./config/boot');

// Read server environment configuration
const environment = require('./config/environment');

// Load server initialization code
const init = require('./server');

async function start() {
  // Create a server instance.
  const server = await init(environment);

  // Abort mission on uncaught exceptions.
  process.once('uncaughtException', error => {
    server.log('error', error);
    process.exit(1);
  });

  // Abort mission on unhandled promise rejections.
  process.on('unhandledRejection', error => {
    throw error;
  });

  // Launch…
  await server.start();

  // …and we have liftoff.
  server.log('info', { start: server.info });
}

start();
