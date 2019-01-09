const assert = require('assert');

function validationError(attribute) {
  return `License: Invalid "${attribute}" provided`;
}

function validateParams({ id, name, groups, compatibility, regexp, url }) {
  assert(typeof id === 'string' && id.length > 0, validationError('id'));
  assert(typeof name === 'string' && name.length > 0, validationError('name'));
  assert(Array.isArray(groups), validationError('groups'));
  assert(Array.isArray(compatibility), validationError('compatibility'));
  assert(regexp instanceof RegExp, validationError('regexp'));
  assert(!url || typeof url === 'string', validationError('url'));
}

class License {
  constructor(params) {
    validateParams(params);
    Object.assign(this, params);
  }

  match(value) {
    return this.regexp.test(value);
  }

  isInGroup(groupId) {
    return this.groups.includes(groupId);
  }

  // Returns the license id with any `-ported` suffix removed.
  unportedId() {
    return this.id.replace(/-ported+$/, '');
  }
}

module.exports = License;
