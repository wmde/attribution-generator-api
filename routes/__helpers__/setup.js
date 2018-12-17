const environment = require('../../config/environment');
const init = require('../../server');

function enhance(response) {
  const enhanced = Object.create(response);

  const ctype = response.headers['content-type'];
  enhanced.type = ctype.split(/ *; */).shift();
  enhanced.status = response.statusCode;

  if (enhanced.type === 'application/json') {
    enhanced.payload = JSON.parse(response.payload);
  }

  return enhanced;
}

class ServerContext {
  constructor(overrides = {}) {
    this.environment = { ...environment, ...overrides };
    this.server = undefined;
  }

  async init() {
    this.server = await init(this.environment);
  }

  // eslint-disable-next-line class-methods-use-this
  async clean() {
    // Put any cleanup of shared state here
  }

  async inject(options) {
    const response = await this.server.inject(options);
    return enhance(response);
  }

  async destroy() {
    await this.server.stop();
    this.server = undefined;
  }
}

async function setup(overrides = {}) {
  const context = new ServerContext(overrides);
  await context.init();
  await context.clean();
  return context;
}

module.exports = setup;
