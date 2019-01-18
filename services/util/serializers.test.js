const serializers = require('./serializers');

describe('license()', () => {
  const { license: serialize } = serializers;
  const license = {
    id: 'cc-by-sa-4.0',
    name: 'CC BY-SA 4.0',
    groups: ['cc', 'cc4'],
    compatibility: [],
    regexp: /ab+c/,
    url: 'https://example.org/licenses/by-sa/4.0',
  };

  it('serializes a license object into the specified format', () => {
    const serialized = serialize(license);
    expect(serialized).toEqual({
      code: 'cc-by-sa-4.0',
      name: 'CC BY-SA 4.0',
      url: 'https://example.org/licenses/by-sa/4.0',
      groups: ['cc', 'cc4'],
    });
  });

  it('does not fail if the object misses the required keys', () => {
    const serialized = serialize({});
    expect(serialized).toEqual({
      code: undefined,
      name: undefined,
      url: undefined,
      groups: undefined,
    });
  });
});
