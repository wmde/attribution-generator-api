const License = require('./license');

describe('license', () => {
  const options = {
    id: 'cc-by-sa-4.0',
    name: 'CC BY-SA 4.0',
    groups: ['cc', 'cc4'],
    compatibility: [],
    regexp: /^(Bild-)?CC-BY-SA(-|\/)4.0(([^-]+.+|-migrated)*)?$/i,
    url: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode',
  };

  function newLicense(overrides = {}) {
    return new License({ ...options, ...overrides });
  }

  it('initalizes', () => {
    newLicense();
  });

  describe('validations', () => {
    it('asserts valid id', () => {
      expect(() => newLicense({ id: 123 })).toThrow();
    });

    it('asserts valid name', () => {
      expect(() => newLicense({ name: '' })).toThrow();
    });

    it('asserts valid groups', () => {
      expect(() => newLicense({ groups: 'pd' })).toThrow();
    });

    it('asserts valid compatibility', () => {
      expect(() => newLicense({ compatibility: 'cc-by-sa-3.0-de' })).toThrow();
    });

    it('asserts valid regex', () => {
      expect(() => newLicense({ regexp: '(cc-zero|Bild-CC-0)' })).toThrow();
    });

    it('asserts valid url', () => {
      expect(() => newLicense({ url: 123 })).toThrow();
    });
  });

  describe('match()', () => {
    const subject = newLicense();

    it('matches valid license', () => {
      expect(subject.match('CC-BY-SA-4.0')).toBeTruthy();
    });

    it('mismatches invalid license', () => {
      expect(subject.match('Blerg')).toBeFalsy();
    });
  });
});
