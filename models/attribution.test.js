const { Attribution } = require('./attribution');
const License = require('./license');

describe('attribution', () => {
  const exampleCC4License = new License({
    id: 'cc-by-sa-4.0',
    name: 'CC BY-SA 4.0',
    groups: ['cc', 'cc4'],
    compatibility: [],
    regexp: /^(Bild-)?CC-BY-SA(-|\/)4.0(([^-]+.+|-migrated)*)?$/i,
    url: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode',
  });

  const exampleCC2License = new License({
    id: 'cc-by-sa-2.5',
    name: 'CC BY-SA 2.5',
    groups: ['cc', 'cc2.5', 'ccby'],
    compatibility: [],
    regexp: /^CC-BY-2.5-\w+$/i,
    url: 'https://creativecommons.org/licenses/by-sa/2.5/legalcode',
  });

  const examplePublicDomainLicense = new License({
    id: 'PD-1923',
    name: 'Public Domain',
    groups: ['pd'],
    compatibility: ['cc-by-4.0', 'cc-by-sa-4.0'],
    regexp: /PD-1923/,
    url: 'https://commons.wikimedia.org/wiki/Template:PD-1923',
  });

  const options = {
    fileInfo: {
      rawUrl: 'https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg',
      title: 'File:Eisklettern kl engstligenfall.jpg',
      artistHtml:
        '<a href="//commons.wikimedia.org/w/index.php?title=User:Bernhard&amp;action=edit&amp;redlink=1" class="new" title="User:Bernhard (page does not exist)">Bernhard</a>',
      attributionHtml: null,
    },
    typeOfUse: 'online',
    languageCode: 'de',
    license: exampleCC2License,
    modification: null,
    modificationAuthor: null,
    isEdited: false,
  };

  function newAttribution(overrides = {}) {
    return new Attribution({ ...options, ...overrides });
  }

  it('initalizes', () => {
    newAttribution();
  });

  describe('validations', () => {
    it('asserts valid fileInfo.rawUrl', () => {
      expect(() => newAttribution({ fileInfo: { rawUrl: 123, title: 'title' } })).toThrow();
    });

    it('asserts valid fileInfo.title', () => {
      expect(() => newAttribution({ fileInfo: { rawUrl: 'url', title: '' } })).toThrow();
    });

    it('asserts valid typeOfUse', () => {
      expect(() => newAttribution({ typeOfUse: 'print' })).toThrow();
    });

    it('asserts valid languageCode', () => {
      expect(() => newAttribution({ languageCode: 'yo' })).toThrow();
    });

    it('asserts valid fileInfo.artistHtml', () => {
      expect(() => newAttribution({ fileInfo: { artistHtml: 123 } })).toThrow();
    });

    it('asserts valid fileInfo.attributionHtml', () => {
      expect(() => newAttribution({ fileInfo: { attributionHtml: 123 } })).toThrow();
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

  describe('when initialized with defaults', () => {
    it('generates an html attribution', () => {
      expect(newAttribution().html()).toEqual(
        '<a href="https://commons.wikimedia.org/wiki/User:Bernhard">Bernhard</a>, <a href="https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg">Eisklettern kl engstligenfall</a>, <a href="https://creativecommons.org/licenses/by-sa/2.5/legalcode" rel="license">CC BY-SA 2.5</a>'
      );
    });

    it('generates a plain text attribution', () => {
      expect(newAttribution().plainText()).toEqual(
        'Bernhard (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), „Eisklettern kl engstligenfall“, https://creativecommons.org/licenses/by-sa/2.5/legalcode'
      );
    });
  });

  describe('when typeOfUse is offline', () => {
    describe('with the cc2 license', () => {
      it('generates an html attribution', () => {
        expect(newAttribution({ typeOfUse: 'offline' }).html()).toEqual(
          'Bernhard (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), „Eisklettern kl engstligenfall“, https://creativecommons.org/licenses/by-sa/2.5/legalcode'
        );
      });

      it('generates a plain text attribution', () => {
        expect(newAttribution({ typeOfUse: 'offline' }).plainText()).toEqual(
          'Bernhard (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), „Eisklettern kl engstligenfall“, https://creativecommons.org/licenses/by-sa/2.5/legalcode'
        );
      });
    });

    describe('when we use a cc4 license', () => {
      const subject = newAttribution({ license: exampleCC4License, typeOfUse: 'offline' });

      it('generates an html attribution', () => {
        expect(subject.html()).toEqual(
          'Bernhard (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), https://creativecommons.org/licenses/by-sa/4.0/legalcode'
        );
      });

      it('generates a plain text attribution', () => {
        expect(subject.plainText()).toEqual(
          'Bernhard (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), https://creativecommons.org/licenses/by-sa/4.0/legalcode'
        );
      });
    });
  });

  describe('when we use a cc4 license', () => {
    const subject = newAttribution({ license: exampleCC4License });

    it('generates an html attribution', () => {
      expect(subject.html()).toEqual(
        '<a href="https://commons.wikimedia.org/wiki/User:Bernhard">Bernhard</a>, <a href="https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg">Eisklettern kl engstligenfall</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/legalcode" rel="license">CC BY-SA 4.0</a>'
      );
    });

    it('generates a plain text attribution', () => {
      expect(subject.plainText()).toEqual(
        'Bernhard (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), „Eisklettern kl engstligenfall“, https://creativecommons.org/licenses/by-sa/4.0/legalcode'
      );
    });
  });

  describe('when we use a public domain license', () => {
    const subject = newAttribution({ license: examplePublicDomainLicense });

    it('generates an html attribution', () => {
      expect(subject.html()).toEqual(
        '<a href="https://commons.wikimedia.org/wiki/User:Bernhard">Bernhard</a>, <a href="https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg">Eisklettern kl engstligenfall</a>, als gemeinfrei gekennzeichnet, Details auf <a href="https://commons.wikimedia.org/wiki/Template:PD-1923" rel="license">Wikimedia Commons</a>'
      );
    });

    it('generates a plain text attribution', () => {
      expect(subject.plainText()).toEqual(
        'Bernhard (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), „Eisklettern kl engstligenfall“, als gemeinfrei gekennzeichnet, Details auf Wikimedia Commons: https://commons.wikimedia.org/wiki/Template:PD-1923'
      );
    });
  });

  describe('when attributionHtml is present', () => {
    const subject = newAttribution({
      fileInfo: {
        rawUrl: 'https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg',
        title: 'File:Eisklettern kl engstligenfall.jpg',
        artistHtml: 'artistHtml',
        attributionHtml:
          '<a href="https://en.wikipedia.org/wiki/User:Rhorn" class="extiw" title="en:User:Rhorn">Rhorn</a> at the <a href="https://en.wikipedia.org/wiki/" class="extiw" title="w:">English language Wikipedia</a>',
      },
    });

    it('generates an html attribution', () => {
      expect(subject.html()).toEqual(
        '<a href="https://en.wikipedia.org/wiki/User:Rhorn">Rhorn</a> at the <a href="https://en.wikipedia.org/wiki/">English language Wikipedia</a>, <a href="https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg">Eisklettern kl engstligenfall</a>, <a href="https://creativecommons.org/licenses/by-sa/2.5/legalcode" rel="license">CC BY-SA 2.5</a>'
      );
    });

    it('generates a plain text attribution', () => {
      expect(subject.plainText()).toEqual(
        'Rhorn at the English language Wikipedia (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), „Eisklettern kl engstligenfall“, https://creativecommons.org/licenses/by-sa/2.5/legalcode'
      );
    });
  });

  describe('when neither, attributionHtml nor artistHtml is present', () => {
    const subject = newAttribution({
      fileInfo: {
        rawUrl: 'https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg',
        title: 'File:Eisklettern kl engstligenfall.jpg',
      },
    });

    it('generates an html attribution', () => {
      expect(subject.html()).toEqual(
        'anonym, <a href="https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg">Eisklettern kl engstligenfall</a>, <a href="https://creativecommons.org/licenses/by-sa/2.5/legalcode" rel="license">CC BY-SA 2.5</a>'
      );
    });

    it('generates a plain text attribution', () => {
      expect(subject.plainText()).toEqual(
        'anonym (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), „Eisklettern kl engstligenfall“, https://creativecommons.org/licenses/by-sa/2.5/legalcode'
      );
    });
  });

  describe('when requesting the locale "en"', () => {
    const subject = newAttribution({ languageCode: 'en' });

    it('generates an html attribution', () => {
      expect(subject.html()).toEqual(
        '<a href="https://commons.wikimedia.org/wiki/User:Bernhard">Bernhard</a>, <a href="https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg">Eisklettern kl engstligenfall</a>, <a href="https://creativecommons.org/licenses/by-sa/2.5/legalcode" rel="license">CC BY-SA 2.5</a>'
      );
    });
    it('generates a plain text attribution', () => {
      expect(subject.plainText()).toEqual(
        'Bernhard (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), „Eisklettern kl engstligenfall“, https://creativecommons.org/licenses/by-sa/2.5/legalcode'
      );
    });
  });

  describe('when it was edited', () => {
    it('generates an html attribution', () => {
      expect(newAttribution({ isEdited: true }).html()).toEqual(
        '<a href="https://commons.wikimedia.org/wiki/User:Bernhard">Bernhard</a>, <a href="https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg">Eisklettern kl engstligenfall</a>, bearbeitet, <a href="https://creativecommons.org/licenses/by-sa/2.5/legalcode" rel="license">CC BY-SA 2.5</a>'
      );
    });

    it('generates a plain text attribution', () => {
      expect(newAttribution({ isEdited: true }).plainText()).toEqual(
        'Bernhard (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), „Eisklettern kl engstligenfall“, bearbeitet, https://creativecommons.org/licenses/by-sa/2.5/legalcode'
      );
    });

    describe('when requesting the locale "en"', () => {
      const subject = newAttribution({ languageCode: 'en', isEdited: true });

      it('generates an html attribution', () => {
        expect(subject.html()).toEqual(
          '<a href="https://commons.wikimedia.org/wiki/User:Bernhard">Bernhard</a>, <a href="https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg">Eisklettern kl engstligenfall</a>, modified, <a href="https://creativecommons.org/licenses/by-sa/2.5/legalcode" rel="license">CC BY-SA 2.5</a>'
        );
      });

      it('generates a plain text attribution', () => {
        expect(subject.plainText()).toEqual(
          'Bernhard (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), „Eisklettern kl engstligenfall“, modified, https://creativecommons.org/licenses/by-sa/2.5/legalcode'
        );
      });
    });

    describe('when there is a modification', () => {
      const subject = newAttribution({ isEdited: true, modification: 'cropped' });

      it('generates an html attribution', () => {
        expect(subject.html()).toEqual(
          '<a href="https://commons.wikimedia.org/wiki/User:Bernhard">Bernhard</a>, <a href="https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg">Eisklettern kl engstligenfall</a>, cropped, <a href="https://creativecommons.org/licenses/by-sa/2.5/legalcode" rel="license">CC BY-SA 2.5</a>'
        );
      });

      it('generates a plain text attribution', () => {
        expect(subject.plainText()).toEqual(
          'Bernhard (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), „Eisklettern kl engstligenfall“, cropped, https://creativecommons.org/licenses/by-sa/2.5/legalcode'
        );
      });
    });

    describe('when there is a modificationAuthor', () => {
      const subject = newAttribution({
        isEdited: true,
        modificationAuthor: 'the great Modificator',
      });

      it('generates an html attribution', () => {
        expect(subject.html()).toEqual(
          '<a href="https://commons.wikimedia.org/wiki/User:Bernhard">Bernhard</a>, <a href="https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg">Eisklettern kl engstligenfall</a>, bearbeitet von the great Modificator, <a href="https://creativecommons.org/licenses/by-sa/2.5/legalcode" rel="license">CC BY-SA 2.5</a>'
        );
      });

      it('generates a plain text attribution', () => {
        expect(subject.plainText()).toEqual(
          'Bernhard (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), „Eisklettern kl engstligenfall“, bearbeitet von the great Modificator, https://creativecommons.org/licenses/by-sa/2.5/legalcode'
        );
      });
    });

    describe('when there is both, a modification and modificationAuthor', () => {
      const subject = newAttribution({
        isEdited: true,
        modification: 'cropped',
        modificationAuthor: 'the great Modificator',
      });

      it('generates an html attribution', () => {
        expect(subject.html()).toEqual(
          '<a href="https://commons.wikimedia.org/wiki/User:Bernhard">Bernhard</a>, <a href="https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg">Eisklettern kl engstligenfall</a>, cropped von the great Modificator, <a href="https://creativecommons.org/licenses/by-sa/2.5/legalcode" rel="license">CC BY-SA 2.5</a>'
        );
      });

      it('generates a plain text attribution', () => {
        expect(subject.plainText()).toEqual(
          'Bernhard (https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg), „Eisklettern kl engstligenfall“, cropped von the great Modificator, https://creativecommons.org/licenses/by-sa/2.5/legalcode'
        );
      });
    });
  });
});
