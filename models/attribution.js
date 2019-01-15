/*
 * Most of this file was copied as-is (keeping function names intact)
 * and refactored only slightly to make comparisons between this app and the
 * original Lizenhinweisgenerator easier.
 */

const assert = require('assert');
const License = require('./license')
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const KNOWN_LANGUAGES = ['en', 'es', 'pt', 'de', 'uk'];
const KNOWN_TYPES_OF_USE = ['online', 'offline'];
const ATTRIBUTION_TRANSLATIONS = {
  en: {
    'pd-attribution-hint': 'marked as public domain',
    'check-details': 'more details on',
    'anonymous': 'anonymous',
    'by': 'by',
    'edited': 'modified',
  },
  es: {
    'pd-attribution-hint': 'marcado como dominio público',
    'check-details': 'para más detalles véase',
    'anonymous': 'anónimo',
    'by': 'por',
    'edited': 'modificado',
  },
  pt: {
    'pd-attribution-hint': 'marcado como domínio público',
    'check-details': 'para mais detalhes, veja',
    'anonymous': 'anónimo',
    'by': 'por',
    'edited': 'modificado',
  },
  de: {
    'pd-attribution-hint': 'als gemeinfrei gekennzeichnet',
    'check-details': 'Details auf',
    'anonymous': 'anonym',
    'by': 'von',
    'edited': 'bearbeitet',
  },
  uk: {
    'pd-attribution-hint': 'позначено як суспільне надбання',
    'check-details': 'більше деталей на',
    'anonymous': 'анонім',
    'by': 'автор',
    'edited': 'модифіковано',
  },
};


function validationError(attribute) {
  return `Attribution: Invalid "${attribute}" provided`;
}

function t(lang, key) {
  return ATTRIBUTION_TRANSLATIONS[lang][key];
}
function isStringPresent(string) {
  return typeof string === 'string'   && string.length > 0
}

function validateParams({ fileUrl, fileTitle, typeOfUse, languageCode, artistHtml, attributionHtml, license, modification, modificationAuthor }) {
  assert(isStringPresent(fileUrl),                                   validationError('fileUrl'));
  assert(isStringPresent(fileTitle),                                 validationError('fileTitle'));
  assert(KNOWN_TYPES_OF_USE.includes(typeOfUse),                     validationError('typeOfUse'));
  assert(KNOWN_LANGUAGES.includes(languageCode),                     validationError('languageCode'));
  assert(!artistHtml         || isStringPresent(artistHtml),         validationError('artistHtml'));
  assert(!attributionHtml    || isStringPresent(attributionHtml),    validationError('attributionHtml'));
  assert(!modification       || isStringPresent(modification),       validationError('modification'));
  assert(!modificationAuthor || isStringPresent(modificationAuthor), validationError('modificationAuthor'));
  assert(license instanceof License,                                 validationError('license'));
}

function extractTextFromHtml(html) {
  const dom = new JSDOM(html);
  return dom.window.document.body.textContent;
}

function isEdited(self) {
  return isStringPresent(self.modification) ||
         isStringPresent(self.modificationAuthor);
}

function getEditingAttribution(self) {
  if( !isEdited(self) ) {
    return '';
  }

  const change = self.modification || t(self.languageCode, 'edited');

  if( isStringPresent(modificationAuthor) ) {
    const creator = ` ${t(self.languageCode, 'by')} ${self.modificationAuthor}`;
    return `${change} ${creator}`;
  }

  return change;
}

function getAuthorAttribution(self) {
  getAttributionText(self) || getArtistText(self)
}

function getAttributionText(self) {
  const attributionText = self.attributionHtml && extractTextFromHtml(self.attributionHtml).trim();

  if (!isStringPresent(attributionText)) { return; }
  if ( self.typeOfUse == 'offline') { return attributionText; }
  return self.attributionHtml;
}

function getArtistText(self) {
  // note: Lizenzgenerator supports the case that artistHtml is empty
  // by asking the user for input. This should be implemented here,
  // but we don't get the necessary info in the /attribution endpoint.
  // example image: https://en.wikipedia.org/wiki/File:Sodexo.svg

  const text = extractTextFromHtml(self.artistHtml || '');
  if (text.length === 0) { return t(self.languageCode, 'anonymous'); }
  return text;
}

function getArtistHtml(self) {
  // note: Lizenzgenerator supports the case that artistHtml is empty
  // by asking the user for input. This should be implemented here,
  // but we don't get the necessary info in the /attribution endpoint.
  // example image: https://en.wikipedia.org/wiki/File:Sodexo.svg
  const html = self.artistHtml || '';
  if (html.length === 0) { return t(self.languageCode, 'anonymous'); }
  return html;
}

function getPrintAttribution(self) {
  var attribution = `${getAuthorAttribution(self)} (${self.fileUrl})`;

  if (!self.license.isInGroup( 'cc4' )) {
    attribution += `, „${self.fileTitle}“`;
  }
  var editingAttribution = getEditingAttribution(self);
  if (editingAttribution) {
    attribution += ', ' + editingAttribution;
  }

  var url = self.license.url;
  if (url) {
    attribution += ', ';
    if (!editingAttribution && self.license.isInGroup('pd') ) {
      attribution += t(self.languageCode, 'pd-attribution-hint' )
                   + ', '
                   + t(self.languageCode, 'check-details' )
                   + ' Wikimedia Commons: ';
    }
    attribution += url;
  }

  return attribution;
}

function getHtmlAttribution(self) {
  var attributionLink;
  var editingAttribution = getEditingAttribution(self);

  if (!editingAttribution && self.license.isInGroup('pd')) {
    attributionLink = ', ' + t(self.languageCode, 'dialogue.pd-attribution-hint' );
    if ( self.license.url) {
      attributionLink += `, ${t(self.languageCode, 'dialogue.check-details')} <a href="${self.license.url}">Wikimedia Commons</a>`;
    }
  } else {
    attributionLink = ', ' + getHtmlLicense(self);
  }

  if( editingAttribution ) {
    editingAttribution = ', ' + editingAttribution;
  }

  return ( getAuthorAttribution(self) || getArtistHtml(self) ) + ', '
    + `<a href="${self.fileUrl}">${self.fileTitle}</a>`
    + editingAttribution
    + attributionLink;
}

function getHtmlLicense(self) {
  var url = self.license.url;
  if (url) {
    return `<a href="${url}">${self.license.name}</a>`;
  }

  return self.license.name;
}

function getAttributionAsTextWithLinks(self) {
  let urlSnippet = '';
  const url = self.license.url;
  if (url) { urlSnippet = ', ' + url; }

  let editingAttribution = getEditingAttribution(self);
  if (editingAttribution) { editingAttribution = ', ' + editingAttribution; }


  return getAuthorAttribution(self)
         + ` (${self.fileUrl}), „${self.fileTitle}“`
         + editingAttribution
         + urlSnippet;
}

class Attribution {
  constructor(params) {
    validateParams(params);
    Object.assign(this, params);
    console.log({this: this})
  }

  html() {
    if (this.typeOfUse == 'offline') {
      return getPrintAttribution(this);
    }
    return getHtmlAttribution(this);
  }

  plainText() {
    if (this.typeOfUse == 'offline' || !this.license.isInGroup('cc4')) {
      return getPrintAttribution(this);
    }
    return getAttributionAsTextWithLinks(this);
  }
}

module.exports = Attribution;
