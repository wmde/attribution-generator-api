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

class LicenseStore {
  constructor(unportedLicenses, portedLicenses) {
    this.licenses = unportedLicenses.map(attrs => {
      const license = new License(...attrs);
      return license;
    });

    this.index = this.licenses.reduce(
      (idx, license) => Object.assign(idx, { [license.id]: license }),
      {}
    );

    this.ports = portedLicenses;
  }

  all() {
    return this.licenses;
  }

  get(id) {
    return this.index[id];
  }

  match(templates) {
    // eslint-disable-next-line no-restricted-syntax
    for (const license of this.licenses) {
      const template = templates.find(t => license.match(t));

      // eslint-disable-next-line no-continue
      if (typeof template === 'undefined') continue;

      if (!license.isPortedLicense()) return license; // not a ported license

      const url = this.ports[template.toLowerCase()];

      if (!url) return license; // no known URL mapping for ported license found

      const name = template
        .toUpperCase()
        .replace(/-/g, ' ')
        .replace('BY SA', 'BY-SA');

      const { id, groups, compatibility, regexp } = license;

      const ported = new License(id, name, [...groups, 'knownPorted'], compatibility, regexp, url);

      return ported;
    }

    return null;
  }

  compatible(id) {
    const { compatibility } = this.get(id);
    return compatibility.map(cid => this.get(cid));
  }
}

module.exports = LicenseStore;
