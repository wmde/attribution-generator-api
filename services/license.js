const assert = require('assert');

function validationError(attribute) {
  return `License: Invalid "${attribute}" provided`;
}

function assertParams({ id, name, groups, compatibility, regexp, url }) {
  assert(typeof id === 'string' && id.length > 0, validationError('id'));
  assert(typeof name === 'string' && name.length > 0, validationError('id'));
  assert(Array.isArray(groups), validationError('id'));
  assert(Array.isArray(compatibility), validationError('id'));
  assert(regexp instanceof RegExp, validationError('id'));
  assert(!url || typeof url === 'string', validationError('id'));
}

class License {
  constructor(params) {
    assertParams(params);
    Object.assign(this, params);
  }

  match(value) {
    return this.regexp.test(value);
  }

  isInGroup(groupId) {
    return this.groups.includes(groupId);
  }
}

module.exports = License;
