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

// Returns an index of licenses by license-id.
//
// Example:
// {
//   'cc-by-sa-3.0': { id: ..., name: ..., ... },
// }
function buildLicensesIndex(licenses) {
  return licenses.reduce(
    (licensesIndex, license) => Object.assign(licensesIndex, { [license.id]: license }),
    {}
  );
}

// Returns an index of license-ids by license name.
//
// Example:
// {
//   'CC BY-SA 3.0': ['cc-by-sa-3.0', 'cc-by-sa-3.0-ported'],
// }
function buildLicenseNamesIndex(licenses) {
  return licenses.reduce((licenseNamesIndex, license) => {
    const licensesWithSameName = licenseNamesIndex[license.name] || [];
    licensesWithSameName.push(license.id);
    return Object.assign(licenseNamesIndex, { [license.name]: licensesWithSameName });
  }, {});
}

// Returns the `license` with updated `url` from the list of portReferences
// if the `licenseString` is present as key in portReferences AND the `license`
// is in group 'ported'; otherwise it returns the original `license`.
function selectLicense(license, licenseString, portReferences) {
  const url = portReferences[licenseString.toLowerCase()];

  if (license.isInGroup('ported') && !!url) {
    return buildPortedLicense(license, licenseString, url);
  }
  return license;
}

class LicenseStore {
  constructor(licenses, portReferences) {
    this.licenses = licenses.map(attrs => buildLicense(attrs));
    this.portReferences = portReferences;
    this.indices = {
      id: buildLicensesIndex(this.licenses),
      name: buildLicenseNamesIndex(this.licenses),
    };
  }

  // Returns all licenses with a name and url from `config/licenses/licenses.js`.
  all() {
    return this.licenses.filter(({ name, url }) => !!name && !!url);
  }

  // Returns all compatible licenses for the passed license name.
  compatible(name) {
    const license = this.getLicenseByName(name);
    if (license) {
      const { compatibility } = license;
      return compatibility.map(cid => this.getLicenseById(cid));
    }
    return [];
  }

  // Returns the first license in the list of licenses.js that matches one of the
  // passed licenseStrings.
  match(licenseStrings) {
    // eslint-disable-next-line no-restricted-syntax
    for (const license of this.licenses) {
      const template = licenseStrings.find(t => license.match(t));
      // eslint-disable-next-line no-continue
      if (typeof template === 'undefined') continue;
      return selectLicense(license, template, this.portReferences);
    }

    return null;
  }

  // Returns the license with the passed id.
  getLicenseById(id) {
    return this.indices.id[id] || null;
  }

  // Returns the first license with the passed name.
  // Ordered by occurrence in `config/licenses/licenses.js`.
  getLicenseByName(name) {
    const licenseIds = this.indices.name[name];
    if (licenseIds) {
      return this.getLicenseById(licenseIds[0]);
    }
    return null;
  }
}

module.exports = LicenseStore;
