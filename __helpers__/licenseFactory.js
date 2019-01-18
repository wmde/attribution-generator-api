const License = require('../models/license');

function licenseFactory({
  id = 'cc-by-sa-3.0',
  name = 'CC BY-SA 3.0',
  groups = ['cc', 'cc4'],
  compatibility = [],
  regexp = /^(Bild-)?CC-BY-SA(-|\/)4.0(([^-]+.+|-migrated)*)?$/i,
  url = 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
}) {
  return new License({ id, name, url, groups, compatibility, regexp });
}

module.exports = licenseFactory;
