const path = require('path');
const repl = require('repl');
const history = require('repl.history');

const pkg = require('./package.json');

require('./config/boot');

const environment = require('./config/environment');
const init = require('./server');

async function main() {
  const motd = `${pkg.name}, ${pkg.version}`;

  console.log(motd); // eslint-disable-line no-console

  const server = await init({ ...environment, logging: false });

  const r = repl.start({});
  history(r, path.resolve(__dirname, '.console_history'));

  Object.assign(r.context, { server, ...server.app });

  r.on('exit', () => {
    server.stop();
  });
}

main();
