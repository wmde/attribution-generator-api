const dotenv = require('dotenv');
const path = require('path');

async function setup() {
  dotenv.config({ path: path.resolve(__dirname, '.env.test') });
}

module.exports = setup;
