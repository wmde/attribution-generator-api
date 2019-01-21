const serializers = require('./serializers');
const licenseFactory = require('../../__helpers__/licenseFactory');
const attributionFactory = require('../../__helpers__/attributionFactory');

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
