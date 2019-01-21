const licenseFactory = require('./licenseFactory');
const { Attribution } = require('../models/attribution');

function attributionFactory({
  fileInfo = {
    rawUrl: 'https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg',
    title: 'File:Eisklettern kl engstligenfall.jpg',
    artistHtml:
      '<a href="//commons.wikimedia.org/w/index.php?title=User:Bernhard&amp;action=edit&amp;redlink=1" class="new" title="User:Bernhard (page does not exist)">Bernhard</a>',
    attributionHtml: null,
  },
  typeOfUse = 'online',
  languageCode = 'de',
  license = licenseFactory({}),
  modification = null,
  modificationAuthor = null,
  isEdited = false,
}) {
  return new Attribution({
    fileInfo,
    typeOfUse,
    languageCode,
    license,
    modification,
    modificationAuthor,
    isEdited,
  });
}

module.exports = attributionFactory;
