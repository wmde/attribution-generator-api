const Files = require('./files');
const Client = require('./util/client');

const expectedFiles = require('./__fixtures__/expectedFiles');

// NOTE: this is a tmp integration test to easify development
// we probably do not want to run this by default in the future
// (only on CI maybe)
describe('getPageImages()', () => {
  const client = new Client();
  const service = new Files({ client });
  const urls = [
    'https://de.wikipedia.org/wiki/K%C3%B6nigsberg_in_Bayern',
    'http://de.wikipedia.org/wiki/K%C3%B6nigsberg_in_Bayern',
    '//de.wikipedia.org/wiki/K%C3%B6nigsberg_in_Bayern',
    'de.wikipedia.org/wiki/K%C3%B6nigsberg_in_Bayern',
    'https://de.m.wikipedia.org/wiki/K%C3%B6nigsberg_in_Bayern',

    'http://de.wikipedia.org/wiki/Königsberg_in_Bayern',
    '//de.wikipedia.org/wiki/Königsberg_in_Bayern',
    'de.wikipedia.org/wiki/Königsberg_in_Bayern',
    'https://de.m.wikipedia.org/wiki/Königsberg_in_Bayern',

    // parameters other than title are ignored
    'https://de.wikipedia.org/wiki/K%C3%B6nigsberg_in_Bayern?uselang=en',
    'http://de.wikipedia.org/wiki/K%C3%B6nigsberg_in_Bayern?uselang=en',
    '//de.wikipedia.org/wiki/K%C3%B6nigsberg_in_Bayern?uselang=en',
    'de.wikipedia.org/wiki/K%C3%B6nigsberg_in_Bayern?uselang=en',
    'https://de.m.wikipedia.org/wiki/K%C3%B6nigsberg_in_Bayern?uselang=en',

    'https://de.wikipedia.org/w/index.php?title=K%C3%B6nigsberg_in_Bayern',
    'http://de.wikipedia.org/w/index.php?title=K%C3%B6nigsberg_in_Bayern',
    '//de.wikipedia.org/w/index.php?title=K%C3%B6nigsberg_in_Bayern',
    'de.wikipedia.org/w/index.php?title=K%C3%B6nigsberg_in_Bayern',
    'https://de.m.wikipedia.org/w/index.php?title=K%C3%B6nigsberg_in_Bayern',

    // parameters other than title are ignored
    'https://de.wikipedia.org/w/index.php?title=K%C3%B6nigsberg_in_Bayern&uselang=de',
    'http://de.wikipedia.org/w/index.php?title=K%C3%B6nigsberg_in_Bayern&uselang=de',
    '//de.wikipedia.org/w/index.php?title=K%C3%B6nigsberg_in_Bayern&uselang=de',
    'de.wikipedia.org/w/index.php?title=K%C3%B6nigsberg_in_Bayern&uselang=de',
    'https://de.m.wikipedia.org/w/index.php?title=K%C3%B6nigsberg_in_Bayern&uselang=de',
  ];

  urls.forEach(url => {
    it(`when requesting files for '${url}'`, async () => {
      const response = await service.getPageImages(url);
      expect(response).toEqual(expectedFiles);
    });
  });
});
