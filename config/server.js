// Configure the server host.
const host = 'localhost';

// Configure the TCP port to bind to.
const port = parseInt(process.env.PORT, 10) || 8080;

// Conditionally enable debugging output (if "DEBUG=true").
const debug =
  process.env.DEBUG === 'true' ? { log: '*', request: '*' } : { request: ['implementation'] };

module.exports = { host, port, debug };
