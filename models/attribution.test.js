const Attribution = require('./attribution');
const License = require('./license')

describe('attribution', () => {
  const exampleCC4License = new License({
    id: 'cc-by-sa-4.0',
    name: 'CC BY-SA 4.0',
    groups: ['cc', 'cc4'],
    compatibility: [],
    regexp: /^(Bild-)?CC-BY-SA(-|\/)4.0(([^-]+.+|-migrated)*)?$/i,
    url: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode',
  });

  const exampleCC3License = new License({
    id: 'cc-by-sa-3.0',
    name: 'CC BY-SA 3.0',
    groups: ['cc', 'cc3'],
    compatibility: [],
    regexp: /^(Bild-)?CC-BY-SA(-|\/)3.0(([^-]+.+|-migrated)*)?$/i,
    url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
  });
  const options = {
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg',
    fileTitle: 'File:Eisklettern_kl_engstligenfall.jpg',
    typeOfUse: 'online',
    languageCode: 'de',
    artistHtml: '<a href="//commons.wikimedia.org/w/index.php?title=User:Bernhard&amp;action=edit&amp;redlink=1" class="new" title="User:Bernhard (page does not exist)">Bernhard</a>',
    attributionHtml: '<a href="https://en.wikipedia.org/wiki/User:Rhorn" class="extiw" title="en:User:Rhorn">Rhorn</a> at the <a href="https://en.wikipedia.org/wiki/" class="extiw" title="w:">English language Wikipedia</a>',
    license: exampleCC3License,
    modification: null,
    modificationAuthor: null,
  };

  function newAttribution(overrides = {}) {
    return new Attribution({ ...options, ...overrides });
  }

  it('initalizes', () => {
    newAttribution();
  });

  describe('validations', () => {
    it('asserts valid fileUrl', () => {
      expect(() => newAttribution({ fileUrl: 123 })).toThrow();
    });

    it('asserts valid fileTitle', () => {
      expect(() => newAttribution({ fileTitle: '' })).toThrow();
    });

    it('asserts valid typeOfUse', () => {
      expect(() => newAttribution({ typeOfUse: 'print' })).toThrow();
    });

    it('asserts valid languageCode', () => {
      expect(() => newAttribution({ languageCode: 'yo' })).toThrow();
    });

    it('asserts valid artistHtml', () => {
      expect(() => newAttribution({ artistHtml: 123 })).toThrow();
    });

    it('asserts valid artistHtml', () => {
      expect(() => newAttribution({ artistHtml: 123 })).toThrow();
    });

    it('asserts valid license', () => {
      expect(() => newAttribution({ license: 'public domain' })).toThrow();
    });

    it('asserts valid modification', () => {
      expect(() => newAttribution({ modification: 123 })).toThrow();
    });

    it('asserts valid modificationAuthor', () => {
      expect(() => newAttribution({ modificationAuthor: 123 })).toThrow();
    });
  });

  describe('html()', () => {
    const subject = newAttribution();

    it('generates an attribution', () => {
      expect(subject.html()).toEqual('');
    });

    describe('when typeOfUse is offline', () => {
      const subject = newAttribution({ typeOfUse: 'offline' });

      it('generates an attribution', () => {
        expect(subject.html()).toEqual('');
      });
    });
  });

  describe('plainText()', () => {
    const subject = newAttribution();

    it('generates an attribution', () => {
      expect(subject.html()).toEqual('');
    });

    describe('when typeOfUse is offline', () => {
      const subject = newAttribution({ typeOfUse: 'offline' });

      it('generates an attribution', () => {
        expect(subject.html()).toEqual('');
      });
    });
  });
});
