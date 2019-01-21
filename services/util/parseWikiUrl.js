const errors = require('./errors');

const wikipediaRegExp = /([-a-z]{2,})(\.m)?\.wikipedia\.org\//i;
const commonsRegExp = /commons(\.m)?\.wikimedia\.org\/w(iki)?\/?/i;
const uploadRegExp = /upload.wikimedia\.org\/wikipedia\/([-a-z]{2,})\//i;

const namePrefixes = ['#mediaviewer/', '#/media/', 'wiki/'];

// Returns the tail part of `string` after `subString`
// e.g. tail('John Doe', 'ohn ') == 'Doe'
function tail(string, subString) {
  const keyLoc = string.indexOf(subString);
  if (keyLoc !== -1) {
    return string.substr(keyLoc + subString.length);
  }
  return null;
}

function extractName(url) {
  if (url.indexOf('title=') !== -1) {
    const matches = url.match(/title=([^&]+)/i);
    return matches[1];
  }
  const sanitizedUrl = url.replace(/\?.+$/, '');
  const checks = namePrefixes.map(key => tail(sanitizedUrl, key));
  return checks.find(name => !!name);
}

function splitCommonsUrl(url) {
  const wikiUrl = 'https://commons.wikimedia.org/';
  const title = extractName(url);
  return { title, wikiUrl };
}

function splitUploadUrl(url) {
  const matches = url.match(uploadRegExp);
  const domain = matches[1] === 'commons' ? 'wikimedia' : 'wikipedia';
  const wikiUrl = `https://${matches[1]}.${domain}.org/`;
  const segments = url.split('/');
  const fileName = segments.includes('thumb') ? segments[segments.length - 2] : segments.pop();
  const title = `File:${fileName}`;
  return { title, wikiUrl };
}

function splitWikipediaUrl(url) {
  const matches = url.match(wikipediaRegExp);
  const wikiUrl = `https://${matches[1]}.wikipedia.org/`;
  const title = extractName(url);
  return { title, wikiUrl };
}

function parse(url) {
  if (commonsRegExp.test(url)) {
    return splitCommonsUrl(url);
  }
  if (uploadRegExp.test(url)) {
    return splitUploadUrl(url);
  }
  if (wikipediaRegExp.test(url)) {
    return splitWikipediaUrl(url);
  }
  throw new Error(errors.invalidUrl);
}

module.exports = parse;
