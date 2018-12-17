const assert = require('assert');

// Configure the app secret used for signing JSON Web Tokens.
const secret = process.env.SECRET;
assert.ok(secret, 'No application secret provided, set the "SECRET" env variable');

module.exports = secret;
