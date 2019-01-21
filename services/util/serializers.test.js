const serializers = require('./serializers');
const licenseFactory = require('../../__helpers__/licenseFactory');
const attributionFactory = require('../../__helpers__/attributionFactory');
const fileDataFactory = require('../../__helpers__/fileDataFactory');

describe('license()', () => {
  const { license: serialize } = serializers;
  const license = licenseFactory({
    id: 'cc-by-sa-4.0',
    name: 'CC BY-SA 4.0',
    groups: ['cc', 'cc4'],
    url: 'https://example.org/licenses/by-sa/4.0',
  });

  it('serializes a license object into the specified format', () => {
    expect(serialize(license)).toEqual({
      code: 'cc-by-sa-4.0',
      name: 'CC BY-SA 4.0',
      url: 'https://example.org/licenses/by-sa/4.0',
      groups: ['cc', 'cc4'],
    });
  });

  it('does not fail if the object misses the required keys', () => {
    expect(serialize({})).toEqual({
      code: undefined,
      name: undefined,
      url: undefined,
      groups: undefined,
    });
  });
});

describe('attribution()', () => {
  const { attribution: serialize } = serializers;
  const license = licenseFactory({
    id: 'licenseId',
    name: 'licenseName',
    groups: [],
    url: 'licenseUrl',
  });
  const attribution = attributionFactory({
    license,
    fileInfo: {
      rawUrl: 'file_url',
      title: 'file_title',
      artistHtml: 'artist',
    },
  });

  it('serializes a attribution object into the specified format', () => {
    expect(serialize(attribution)).toEqual({
      licenseId: 'licenseId',
      licenseUrl: 'licenseUrl',
      attributionHtml:
        'artist, <a href="file_url">file_title</a>, <a href="licenseUrl" rel="license">licenseName</a>',
      attributionPlain: 'artist (file_url), „file_title“, licenseUrl',
    });
  });

  it('does not fail if the object misses the required keys', () => {
    expect(serialize({})).toEqual({
      licenseId: undefined,
      licenseUrl: undefined,
      attributionHtml: undefined,
      attributionPlain: undefined,
    });
  });
});

describe('fileinfo()', () => {
  const { fileinfo: serialize } = serializers;
  const fileData = fileDataFactory({});
  const license = licenseFactory({});

  it('serializes', () => {
    const serialized = serialize(fileData, license);
    expect(serialized).toEqual({
      license: {
        code: 'cc-by-sa-3.0',
        groups: ['cc', 'cc4'],
        name: 'CC BY-SA 3.0',
        url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode'
      },
      attribution_html: 'Photograph by <a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a>, Wikimedia Commons, Cc-by-sa-2.0-fr',
      author_html: '<a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a> &amp; Musée Bolo',
      media_type: 'image'
    });
  });

  it('does not fail if the fileData object misses the required keys', () => {
    const serialized = serialize({}, license);
    expect(serialized).toEqual({
      license: {
        code: 'cc-by-sa-3.0',
        groups: ['cc', 'cc4'],
        name: 'CC BY-SA 3.0',
        url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode'
      },
      attribution_html: undefined,
      author_html: undefined,
      media_type: undefined,
    });
  });

  it('does not fail if the license object misses the required keys', () => {
    const serialized = serialize(fileData, {});
    expect(serialized).toEqual({
      license: {
        code: undefined,
        groups: undefined,
        name: undefined,
        url: undefined,
      },
      attribution_html: 'Photograph by <a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a>, Wikimedia Commons, Cc-by-sa-2.0-fr',
      author_html: '<a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a> &amp; Musée Bolo',
      media_type: 'image'
    });
  });
});
