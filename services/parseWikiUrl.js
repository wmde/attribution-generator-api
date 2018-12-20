const regExp = /([-a-z]{2,})(\.m)?\.wikipedia\.org\//i;
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

function splitUrl(url) {
  if (!regExp.test(url)) {
    return null;
  }
  const matches = url.match(regExp);
  const wikiUrl = `https://${matches[1]}.wikipedia.org/`;
  const title = extractName(url);
  return { title, wikiUrl };
}

function parse(url) {
  const sanitizedUrl = decodeURI(url);
  return splitUrl(sanitizedUrl);
}

module.exports = parse;
