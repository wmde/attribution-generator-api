const LicenseStore = require('./licenseStore');
const licenses = require('../config/licenses/licenses');
const portReferences = require('../config/licenses/portReferences');

describe('licenseStore', () => {
  const subject = new LicenseStore(licenses, portReferences);

  describe('match()', () => {
    it('detects "Public Domain"', () => {
      const license = subject.match(['PD-self']);
      expect(license.name).toBe('Public Domain');
    });

    it('detects "Copyrighted free use"', () => {
      const license = subject.match(['Copyrighted free use']);
      expect(license.name).toBe('Public Domain');
    });

    it('detects "CC BY 1.0"', () => {
      const license = subject.match(['Cc-by-1.0']);
      expect(license.name).toBe('CC BY 1.0');
    });

    it('detects "CC BY 2.0"', () => {
      const license = subject.match(['Cc-by-2.0']);
      expect(license.name).toBe('CC BY 2.0');
    });

    it('detects "CC BY 2.5"', () => {
      const license = subject.match(['Cc-by-2.5']);
      expect(license.name).toBe('CC BY 2.5');
    });

    it('detects "CC BY SA 2.5"', () => {
      const license = subject.match(['Cc-by-sa-2.5']);
      expect(license.name).toBe('CC BY-SA 2.5');
    });

    it('detects "CC BY SA 2.0"', () => {
      const license = subject.match(['Cc-by-sa-2.0']);
      expect(license.name).toBe('CC BY-SA 2.0');
    });

    it('detects "CC BY SA 1.0"', () => {
      expect(subject.match(['Cc-by-sa-1.0'])).toHaveProperty('name', 'CC BY-SA 1.0');
      expect(subject.match(['cc-by-sa'])).toHaveProperty('name', 'CC BY-SA 1.0');
    });

    it('detects ported "CC BY-SA 1.0 NL"', () => {
      const license = subject.match(['Cc-by-sa-1.0-nl']);
      expect(license.id).toBe('cc-by-sa-1.0-ported');
      expect(license.name).toBe('CC BY-SA 1.0 NL');
    });

    it('detects ported "CC BY 1.0"', () => {
      const license = subject.match(['Cc-by-1.0-nl']);
      expect(license.id).toBe('cc-by-1.0-ported');
      expect(license.name).toBe('CC BY 1.0 NL');
    });

    it('detects ported "CC BY 2.0"', () => {
      const license = subject.match(['Cc-by-2.0-at']);
      expect(license.id).toBe('cc-by-2.0-ported');
      expect(license.name).toBe('CC BY 2.0 AT');
    });

    it('detects ported "CC BY 2.5"', () => {
      const license = subject.match(['Cc-by-2.5-au']);
      expect(license.id).toBe('cc-by-2.5-ported');
      expect(license.name).toBe('CC BY 2.5 AU');
    });

    it('detects ported "CC BY 3.0"', () => {
      const license = subject.match(['Cc-by-3.0-hk']);
      expect(license.id).toBe('cc-by-3.0-ported');
      expect(license.name).toBe('CC BY 3.0 HK');
    });

    it('detects ported "CC BY-SA 2.0"', () => {
      const license = subject.match(['Cc-by-sa-2.0-uk']);
      expect(license.id).toBe('cc-by-sa-2.0-ported');
      expect(license.name).toBe('CC BY-SA 2.0 UK');
    });

    it('detects ported "CC BY-SA 2.5"', () => {
      const license = subject.match(['Cc-by-sa-2.5-it']);
      expect(license.id).toBe('cc-by-sa-2.5-ported');
      expect(license.name).toBe('CC BY-SA 2.5 IT');
    });

    it('detects ported "CC BY-SA 3.0"', () => {
      const license = subject.match(['Cc-by-sa-3.0-tw']);
      expect(license.id).toBe('cc-by-sa-3.0-ported');
      expect(license.name).toBe('CC BY-SA 3.0 TW');
    });

    it('accepts multiple input strings', () => {
      const license = subject.match(['Cc-by-sa-2.0-de', 'Cc-by-sa-2.5']);
      expect(license.id).toBe('cc-by-sa-2.5');
      expect(license.name).toBe('CC BY-SA 2.5');
    });
  });

  describe('compatible()', () => {
    it('finds no compatible licences for "cc by-sa 4.0"', () => {
      expect(subject.compatible('cc-by-sa-4.0')).toEqual([]);
    });

    const cases = {
      'cc-by-sa-3.0': ['cc-by-sa-3.0-de', 'cc-by-sa-4.0'],
      'cc-by-sa-3.0-de': ['cc-by-sa-3.0', 'cc-by-sa-4.0'],
      'cc-by-sa-2.5': ['cc-by-sa-3.0-de', 'cc-by-sa-3.0', 'cc-by-sa-4.0'],
      'cc-by-sa-2.0': [
        'cc-by-sa-2.0-de',
        'cc-by-sa-2.5',
        'cc-by-sa-3.0-de',
        'cc-by-sa-3.0',
        'cc-by-sa-4.0',
      ],
      'cc-by-sa-2.0-de': [
        'cc-by-sa-2.0',
        'cc-by-sa-2.5',
        'cc-by-sa-3.0-de',
        'cc-by-sa-3.0',
        'cc-by-sa-4.0',
      ],
      'cc-by-sa-1.0': [
        'cc-by-sa-2.0',
        'cc-by-sa-2.0-de',
        'cc-by-sa-2.5',
        'cc-by-sa-3.0-de',
        'cc-by-sa-3.0',
        'cc-by-sa-4.0',
      ],
      'cc-by-4.0': ['cc-by-sa-4.0'],
      'cc-by-3.0': ['cc-by-3.0-de', 'cc-by-sa-3.0-de', 'cc-by-sa-3.0'],
      'cc-by-3.0-de': ['cc-by-3.0', 'cc-by-sa-3.0-de', 'cc-by-sa-3.0'],
      'cc-by-2.5': [
        'cc-by-3.0-de',
        'cc-by-3.0',
        'cc-by-4.0',
        'cc-by-sa-2.5',
        'cc-by-sa-3.0-de',
        'cc-by-sa-3.0',
      ],
      'cc-by-2.0': [
        'cc-by-2.0-de',
        'cc-by-2.5',
        'cc-by-3.0-de',
        'cc-by-3.0',
        'cc-by-4.0',
        'cc-by-sa-2.0-de',
        'cc-by-sa-2.0',
      ],
      'cc-by-2.0-de': [
        'cc-by-2.0',
        'cc-by-2.5',
        'cc-by-3.0-de',
        'cc-by-3.0',
        'cc-by-sa-2.0-de',
        'cc-by-sa-2.0',
      ],
      'cc-by-1.0': [
        'cc-by-2.0-de',
        'cc-by-2.0',
        'cc-by-2.5',
        'cc-by-3.0-de',
        'cc-by-3.0',
        'cc-by-sa-1.0',
      ],
    };

    Object.keys(cases).forEach(id => {
      const expected = cases[id];

      it(`finds compatible licenses for "${id}"`, () => {
        const result = subject.compatible(id);
        expect(result).toHaveLength(expected.length);
        const ids = result.map(license => license.id);
        expect(ids).toEqual(expect.arrayContaining(expected));
      });
    });
  });
});
