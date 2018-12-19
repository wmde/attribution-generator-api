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

function buildPortedLicense(license, string, url) {
  const name = normalizeLicense(string);
  const groups = [...license.groups, 'knownPorted'];
  return new License({ ...license, name, groups, url });
}

function normalizeLicense(string) {
  return string.toUpperCase().replace(/-/g, ' ').replace('BY SA', 'BY-SA');
}

function buildLicensesIndex(licenses) {
  return licenses.reduce((idx, license) =>
    Object.assign(idx, { [license.id]: license }),
    {}
  );
}

class LicenseStore {
  constructor(licenses, portReferences) {
    this.licenses = licenses.map(attrs => buildLicense(attrs));
    this.portReferences = portReferences;
    this.index = buildLicensesIndex(this.licenses);
  }

  compatible(id) {
    const { compatibility } = this.getLicense(id);
    return compatibility.map(cid => this.getLicense(cid));
  }

  match(licenseStrings) {
    for (const license of this.licenses) {
      const template = licenseStrings.find(t => license.match(t));
      if (typeof template === 'undefined') continue;
      return this.selectLicense(license, template);
    }

    return null;
  }

  getLicense(id) {
    return this.index[id];
  }

  selectLicense(license, licenseString) {
    const url = this.portReferences[licenseString.toLowerCase()];

    if (license.isInGroup('ported') && !!url) {
      return buildPortedLicense(license, licenseString, url);
    } else {
      return license;
    }
  }
}

module.exports = LicenseStore;
