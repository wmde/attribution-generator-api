function licenseFactory({ id, name, url, groups, compatibility, regexp }) {
  return {
    id: id || 'cc-by-sa-3.0',
    name: name || 'CC BY-SA 3.0',
    groups: groups || ['cc', 'cc4'],
    compatibility: compatibility || [],
    regexp: regexp || /^(Bild-)?CC-BY-SA(-|\/)4.0(([^-]+.+|-migrated)*)?$/i,
    url: url || 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
  };
}

module.exports = licenseFactory;
