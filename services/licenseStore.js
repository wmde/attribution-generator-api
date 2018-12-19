const License = require('./license');

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
