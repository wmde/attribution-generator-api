const assert = require('assert');

class License {
  constructor(id, name, groups, compatibility, regexp, url) {
    assert(typeof id === 'string' && id.length > 0, 'License: Invalid "id" provided');
    assert(typeof name === 'string' && name.length > 0, 'License: Invalid "name" provided');
    assert(Array.isArray(groups), 'License: Invalid "groups" provided');
    assert(Array.isArray(compatibility), 'License: Invalid "compatibility" provided');
    assert(regexp instanceof RegExp, 'License: Invalid "regexp" provided');
    assert(!url || typeof url === 'string', 'License: Invalid "url" provided');

    this.id = id;
    this.name = name;
    this.groups = groups;
    this.compatibility = compatibility;
    this.regexp = regexp;
    this.url = url;
  }

  match(value) {
    return this.regexp.test(value);
  }

  isInGroup(groupId) {
    return this.groups.includes(groupId);
  }

  isPublicDomain() {
    return this.isInGroup('pd');
  }

  isPortedLicense() {
    return this.isInGroup('ported');
  }

  unportedVersionId() {
    return this.id.replace(/-ported$/, ''); // e.g. 'cc-by-3.0' for 'cc-by-3.0-ported'
  }
}

module.exports = License;
