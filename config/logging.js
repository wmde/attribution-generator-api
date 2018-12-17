const bunyan = require('bunyan');
const GoodBunyan = require('good-bunyan');

function logger(/* environment */) {
  // Log to stdout and Stackdriver Logging.
  const streams = [{ stream: process.stdout, level: 'info' }];

  return bunyan.createLogger({ name: 'attribution-generator-api', streams });
}

function config() {
  // Conditionally disable server logging.
  if (process.env.LOG === 'false') return null;

  // Configure logging via "Good" with a single "Bunyan" reporter
  // capable of dispatching log events to multiple streams.

  // Subscribe to all events.
  const events = {
    ops: '*',
    log: '*',
    error: '*',
    request: '*',
    response: '*',
  };

  // Configure the logger instance and the default log levels for events.
  const options = {
    logger: logger(process.env.NODE_ENV),
    levels: {
      ops: 'trace',
      log: 'info',
      error: 'error',
      request: 'trace',
      response: 'info',
    },
  };

  return {
    reporters: {
      default: [
        {
          module: GoodBunyan,
          args: [events, options],
        },
      ],
    },
  };
}

module.exports = config();
