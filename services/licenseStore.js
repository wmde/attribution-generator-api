const License = require('./license');

function buildLicense(params) {
  const attributes = {
    id: params[0],
    name: params[1],
    groups: params[2],
    compatibility: params[3],
    regexp: params[4],
    url: params[5],
  };
  return new License(attributes);
}

function normalizeLicense(string) {
  return string
    .toUpperCase()
    .replace(/-/g, ' ')
    .replace('BY SA', 'BY-SA');
}

function buildPortedLicense(license, string, url) {
  const name = normalizeLicense(string);
  const groups = [...license.groups, 'knownPorted'];
  return new License({ ...license, name, groups, url });
}

function buildLicensesIndex(licenses) {
  return licenses.reduce((idx, license) => Object.assign(idx, { [license.id]: license }), {});
}

class LicenseStore {
  constructor(licenses, portReferences) {
    this.licenses = licenses.map(attrs => buildLicense(attrs));
    this.portReferences = portReferences;
    this.index = buildLicensesIndex(this.licenses);
  }

  // Returns all compatible licenses for the passed license id.
  compatible(id) {
    const { compatibility } = this.getLicense(id);
    return compatibility.map(cid => this.getLicense(cid));
  }

  // Returns the first license in the list of licenses.js that matches one of the
  // passed licenseStrings.
  match(licenseStrings) {
    // eslint-disable-next-line no-restricted-syntax
    for (const license of this.licenses) {
      const template = licenseStrings.find(t => license.match(t));
      // eslint-disable-next-line no-continue
      if (typeof template === 'undefined') continue;
      return this.selectLicense(license, template);
    }

    return null;
  }

  getLicense(id) {
    return this.index[id];
  }

  // Returns the `license` with updated `url` from the list of portReferences
  // if the `licenseString` is present as key in portReferences AND the `license`
  // is in group 'ported'; otherwise it returns the original `license`.
  selectLicense(license, licenseString) {
    const url = this.portReferences[licenseString.toLowerCase()];

    if (license.isInGroup('ported') && !!url) {
      return buildPortedLicense(license, licenseString, url);
    }
    return license;
  }
}

module.exports = LicenseStore;
