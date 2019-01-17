/*
 * Most of this file was copied as-is (keeping function names intact)
 * and refactored only slightly to make comparisons between this app and the
 * original Lizenhinweisgenerator easier.
 */

const assert = require('assert');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const License = require('./license');
const HtmlSaniziter = require('../services/htmlSanitizer');

const KNOWN_LANGUAGES = ['en', 'es', 'pt', 'de', 'uk'];
const KNOWN_TYPES_OF_USE = ['online', 'offline'];
const ATTRIBUTION_TRANSLATIONS = {
  en: {
    'pd-attribution-hint': 'marked as public domain',
    'check-details': 'more details on',
    anonymous: 'anonymous',
    by: 'by',
    edited: 'modified',
  },
  es: {
    'pd-attribution-hint': 'marcado como dominio público',
    'check-details': 'para más detalles véase',
    anonymous: 'anónimo',
    by: 'por',
    edited: 'modificado',
  },
  pt: {
    'pd-attribution-hint': 'marcado como domínio público',
    'check-details': 'para mais detalhes, veja',
    anonymous: 'anónimo',
    by: 'por',
    edited: 'modificado',
  },
  de: {
    'pd-attribution-hint': 'als gemeinfrei gekennzeichnet',
    'check-details': 'Details auf',
    anonymous: 'anonym',
    by: 'von',
    edited: 'bearbeitet',
  },
  uk: {
    'pd-attribution-hint': 'позначено як суспільне надбання',
    'check-details': 'більше деталей на',
    anonymous: 'анонім',
    by: 'автор',
    edited: 'модифіковано',
  },
};

function validationError(attribute) {
  return `Attribution: Invalid "${attribute}" provided`;
}

function t(lang, key) {
  return ATTRIBUTION_TRANSLATIONS[lang][key];
}
function isStringPresent(string) {
  return typeof string === 'string' && string.length > 0;
}

function validateParams({
  fileInfo,
  typeOfUse,
  languageCode,
  license,
  modification,
  modificationAuthor,
  isEdited,
}) {
  assert(isStringPresent(fileInfo.rawUrl), validationError('fileInfo.rawUrl'));
  assert(isStringPresent(fileInfo.title), validationError('fileInfo.title'));
  assert(KNOWN_TYPES_OF_USE.includes(typeOfUse), validationError('typeOfUse'));
  assert(KNOWN_LANGUAGES.includes(languageCode), validationError('languageCode'));
  assert([true, false].includes(isEdited), validationError('isEdited'));
  assert(
    !fileInfo.artistHtml || isStringPresent(fileInfo.artistHtml),
    validationError('fileInfo.artistHtml')
  );
  assert(
    !fileInfo.attributionHtml || isStringPresent(fileInfo.attributionHtml),
    validationError('fileInfo.attributionHtml')
  );
  assert(!modification || isStringPresent(modification), validationError('modification'));
  assert(
    !modificationAuthor || isStringPresent(modificationAuthor),
    validationError('modificationAuthor')
  );
  assert(license instanceof License, validationError('license'));
}

function extractTextFromHtml(html) {
  const dom = new JSDOM(html);
  return dom.window.document.body.textContent;
}

// takes a file identifier string like "File:something.jpg" and returns a
// file name from it ("something").
function fileNameFromIdentifier(identifier) {
  const {
    groups: { name },
  } = /^(?:.+:)?(?<name>.*?)(?:\.[^.]+)?$/.exec(identifier);
  return name;
}

function getEditingAttribution(self) {
  if (!self.isEdited) {
    return '';
  }

  const change = self.modification || t(self.languageCode, 'edited');

  if (isStringPresent(self.modificationAuthor)) {
    const creator = `${t(self.languageCode, 'by')} ${self.modificationAuthor}`;
    return `${change} ${creator}`;
  }

  return change;
}

function getAttributionText(self) {
  if (!isStringPresent(self.attributionHtml)) {
    return '';
  }
  return extractTextFromHtml(self.attributionHtml).trim();
}

function getArtistText(self) {
  // note: Lizenzgenerator supports the case that artistHtml is empty
  // by asking the user for input. This should be implemented here,
  // but we don't get the necessary info in the /attribution endpoint.
  // example image: https://en.wikipedia.org/wiki/File:Sodexo.svg

  const text = extractTextFromHtml(self.artistHtml || '');
  if (text.length === 0) {
    return t(self.languageCode, 'anonymous');
  }
  return text;
}

function getAuthorAttributionText(self) {
  return getAttributionText(self) || getArtistText(self);
}

function getAttributionHtml(self) {
  const attributionText = self.attributionHtml && extractTextFromHtml(self.attributionHtml).trim();

  if (!isStringPresent(attributionText)) {
    return '';
  }
  if (self.typeOfUse === 'offline') {
    return attributionText;
  }
  return self.attributionHtml;
}

function getArtistHtml(self) {
  // note: Lizenzgenerator supports the case that artistHtml is empty
  // by asking the user for input. This should be implemented here,
  // but we don't get the necessary info in the /attribution endpoint.
  // example image: https://en.wikipedia.org/wiki/File:Sodexo.svg
  const html = self.artistHtml || '';
  if (html.length === 0) {
    return t(self.languageCode, 'anonymous');
  }
  return html;
}

function getAuthorAttributionHtml(self) {
  return getAttributionHtml(self) || getArtistHtml(self);
}

function sanitizeHtml(html) {
  const sanitizer = new HtmlSaniziter(html);
  return sanitizer.sanitize();
}

function getPrintAttribution(self) {
  let attribution = `${getAuthorAttributionText(self)} (${self.fileUrl})`;

  if (!self.license.isInGroup('cc4')) {
    attribution += `, „${fileNameFromIdentifier(self.fileTitle)}“`;
  }
  const editingAttribution = getEditingAttribution(self);
  if (editingAttribution) {
    attribution += `, ${editingAttribution}`;
  }

  const { url } = self.license;
  if (url) {
    attribution += ', ';
    if (!editingAttribution && self.license.isInGroup('pd')) {
      attribution += `${t(self.languageCode, 'pd-attribution-hint')}, ${t(
        self.languageCode,
        'check-details'
      )} Wikimedia Commons: `;
    }
    attribution += url;
  }

  return attribution;
}

function getHtmlLicense(self) {
  const { url } = self.license;
  if (url) {
    return `<a href="${url}" rel="license">${self.license.name}</a>`;
  }

  return self.license.name;
}

function getHtmlAttribution(self) {
  let attributionLink;
  let editingAttribution = getEditingAttribution(self);

  if (!editingAttribution && self.license.isInGroup('pd')) {
    attributionLink = `, ${t(self.languageCode, 'pd-attribution-hint')}`;
    if (self.license.url) {
      attributionLink += `, ${t(self.languageCode, 'check-details')} <a href="${
        self.license.url
      }" rel="license">Wikimedia Commons</a>`;
    }
  } else {
    attributionLink = `, ${getHtmlLicense(self)}`;
  }

  if (editingAttribution) {
    editingAttribution = `, ${editingAttribution}`;
  }

  return (
    `${getAuthorAttributionHtml(self)}, ` +
    `<a href="${self.fileUrl}">${fileNameFromIdentifier(
      self.fileTitle
    )}</a>${editingAttribution}${attributionLink}`
  );
}

function getAttributionAsTextWithLinks(self) {
  let urlSnippet = '';
  const { url } = self.license;
  if (url) {
    urlSnippet = `, ${url}`;
  }

  let editingAttribution = getEditingAttribution(self);
  if (editingAttribution) {
    editingAttribution = `, ${editingAttribution}`;
  }

  return `${getAuthorAttributionText(self)} (${self.fileUrl}), „${fileNameFromIdentifier(
    self.fileTitle
  )}“${editingAttribution}${urlSnippet}`;
}

class Attribution {
  constructor(params) {
    validateParams(params);
    Object.assign(this, params);

    this.fileTitle = params.fileInfo.title;
    this.fileUrl = params.fileInfo.rawUrl;
    this.artistHtml = params.fileInfo.artistHtml;
    this.attributionHtml = params.fileInfo.attributionHtml;

    if (isStringPresent(this.artistHtml)) {
      this.artistHtml = sanitizeHtml(this.artistHtml);
    }
    if (isStringPresent(this.attributionHtml)) {
      this.attributionHtml = sanitizeHtml(this.attributionHtml);
    }
  }

  html() {
    if (this.typeOfUse === 'offline') {
      return getPrintAttribution(this);
    }
    return getHtmlAttribution(this);
  }

  plainText() {
    if (this.typeOfUse === 'offline' || !this.license.isInGroup('cc4')) {
      return getPrintAttribution(this);
    }
    return getAttributionAsTextWithLinks(this);
  }
}

module.exports = Attribution;
