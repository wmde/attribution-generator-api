const LicenseStore = require('./licenseStore');
const License = require('./license');
const licenses = require('../config/licenses/licenses');
const portReferences = require('../config/licenses/portReferences');
const compatibleCases = require('./__test__/compatibleCases');

describe('licenseStore', () => {
  const subject = new LicenseStore(licenses, portReferences);

  describe('all()', () => {
    const expectedLicenseParams = {
      compatibility: [],
      groups: ['cc', 'cc4'],
      id: 'cc-by-sa-4.0',
      name: 'CC BY-SA 4.0',
      regexp: /^(Bild-)?CC-BY-SA(-|\/)4.0(([^-]+.+|-migrated)*)?$/i,
      url: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode',
    };

    it('returns licenses', () => {
      const allLicenses = subject.all();
      expect(allLicenses.length).toBeGreaterThan(600);
      expect(allLicenses[0]).toEqual(new License(expectedLicenseParams));
    });

    it('filters out licenses that do not contain a name or url', () => {
      const allLicenses = subject.all();
      expect(allLicenses.every(license => !!license.name)).toBeTruthy();
      expect(allLicenses.every(license => !!license.url)).toBeTruthy();
    });
  });

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
    const expectedKeys = ['id', 'name', 'groups', 'compatibility', 'regexp', 'url'];

    it('returns an array of licenses', () => {
      const compatible = subject.compatible('CC BY-SA 3.0');
      compatible.forEach(license => {
        expect(Object.keys(license)).toEqual(expectedKeys);
      });
    });

    it('finds compatible licenses for "CC BY-SA 3.0"', () => {
      const compatible = subject.compatible('CC BY-SA 3.0');
      expect(compatible.map(license => license.id)).toEqual(['cc-by-sa-3.0-de', 'cc-by-sa-4.0']);
    });

    it('finds no compatible licences for "CC BY-SA 4.0"', () => {
      const compatible = subject.compatible('CC BY-SA 4.0');
      expect(compatible).toEqual([]);
    });

    Object.keys(compatibleCases).forEach(id => {
      const expected = compatibleCases[id];
      const license = subject.getLicenseById(id);

      it(`finds compatible licenses for "${license.name}"`, () => {
        const compatible = subject.compatible(license.name);
        expect(compatible).toHaveLength(expected.length);
        const ids = compatible.map(l => l.id);
        expect(ids).toEqual(expect.arrayContaining(expected));
      });
    });
  });

  describe('getLicenseByName()', () => {
    it('returns the first license with that name', () => {
      const license = subject.getLicenseByName('CC BY-SA 3.0');
      expect(license.id).toEqual('cc-by-sa-3.0');
      expect(license.name).toEqual('CC BY-SA 3.0');
    });
  });
});
