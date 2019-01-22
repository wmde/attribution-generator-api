const Client = require('../services/util/client');
const FileData = require('./fileData');

describe('FileData', () => {
  const client = new Client();
  const fileData = new FileData({ client });

  // We got a list of example url that we need to understand and match.
  // This spec calls all these examples and expects they work against a known
  // good state (snapshop).
  const inputs = [
    // the following are expected to be “normalized” to https://commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg
    [
      {
        title: 'File:Helene_Fischer_2010.jpg',
        normalizedTitle: 'File:Helene Fischer 2010.jpg',
        wikiUrl: 'https://commons.wikimedia.org/',
        rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Helene_Fischer_2010.jpg',
        artistHtml:
          '<a href="//commons.wikimedia.org/w/index.php?title=User:Fleyx24&amp;action=edit&amp;redlink=1" class="new" title="User:Fleyx24 (page does not exist)">Fleyx24</a>',
        attributionHtml: null,
        mediaType: 'BITMAP',
      },
      [
        'File:Helene_Fischer_2010.jpg',
        'Datei:Helene_Fischer_2010.jpg',
        'Fichier:Helene_Fischer_2010.jpg',

        'https://commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg',
        'https://commons.m.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg',
        'http://commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg',
        '//commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg',
        'commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg',

        'https://commons.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg',
        'https://commons.m.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg',
        'http://commons.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg',
        '//commons.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg',
        'commons.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg',

        'https://upload.wikimedia.org/wikipedia/commons/8/84/Helene_Fischer_2010.jpg',
        'http://upload.wikimedia.org/wikipedia/commons/8/84/Helene_Fischer_2010.jpg',
        '//upload.wikimedia.org/wikipedia/commons/8/84/Helene_Fischer_2010.jpg',
        'upload.wikimedia.org/wikipedia/commons/8/84/Helene_Fischer_2010.jpg',

        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Helene_Fischer_2010.jpg/171px-Helene_Fischer_2010.jpg',
        'http://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Helene_Fischer_2010.jpg/171px-Helene_Fischer_2010.jpg',
        '//upload.wikimedia.org/wikipedia/commons/thumb/8/84/Helene_Fischer_2010.jpg/171px-Helene_Fischer_2010.jpg',
        'upload.wikimedia.org/wikipedia/commons/thumb/8/84/Helene_Fischer_2010.jpg/171px-Helene_Fischer_2010.jpg',

        'https://commons.wikimedia.org/wiki/Helene_Fischer#/media/File:Helene_Fischer_2010.jpg',
        'https://commons.m.wikimedia.org/wiki/Helene_Fischer#/media/File:Helene_Fischer_2010.jpg',
        'http://commons.wikimedia.org/wiki/Helene_Fischer#/media/File:Helene_Fischer_2010.jpg',
        '//commons.wikimedia.org/wiki/Helene_Fischer#/media/File:Helene_Fischer_2010.jpg',
        'commons.wikimedia.org/wiki/Helene_Fischer#/media/File:Helene_Fischer_2010.jpg',

        // parameters other than title are ignored
        'https://commons.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg&uselang=de',
        'https://commons.m.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg&uselang=de',
        'http//commons.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg&uselang=de',
        '//commons.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg&uselang=de',
        'commons.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg&uselang=de',

        // parameters other than title are ignored
        'https://commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg?foo=bar',
        'https://commons.m.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg?foo=bar',
        'http://commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg?foo=bar',
        '//commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg?foo=bar',
        'commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg?foo=bar',
      ],
    ],
    // the following are expected to be “normalized” to https://de.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg
    [
      {
        title: 'File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        normalizedTitle: 'Datei:1 FC Bamberg - 1 FC Nürnberg 1901.jpg',
        wikiUrl: 'https://de.wikipedia.org/',
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/de/f/fb/1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        artistHtml: '<p>unbekannt\n</p>',
        attributionHtml: null,
        mediaType: 'BITMAP',
      },
      [
        'https://de.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_Nürnberg_1901.jpg',

        'https://de.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        'https://de.m.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        'http://de.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        '//de.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        'de.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',

        'https://de.wikipedia.org/w/index.php?title=File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        'https://de.m.wikipedia.org/w/index.php?title=File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        'http://de.wikipedia.org/w/index.php?title=File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        '//de.wikipedia.org/w/index.php?title=File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        'de.wikipedia.org/w/index.php?title=File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',

        'https://upload.wikimedia.org/wikipedia/de/f/fb/1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        'http://upload.wikimedia.org/wikipedia/de/f/fb/1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        '//upload.wikimedia.org/wikipedia/de/f/fb/1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        'upload.wikimedia.org/wikipedia/de/f/fb/1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',

        'https://upload.wikimedia.org/wikipedia/de/thumb/f/fb/1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg/320px-1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        'http://upload.wikimedia.org/wikipedia/de/thumb/f/fb/1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg/320px-1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        '//upload.wikimedia.org/wikipedia/de/thumb/f/fb/1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg/320px-1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        'upload.wikimedia.org/wikipedia/de/thumb/f/fb/1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg/320px-1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',

        'https://de.wikipedia.org/wiki/S%C3%BCddeutsche_Fu%C3%9Fballmeisterschaft_1901/02#/media/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        'https://de.m.wikipedia.org/wiki/S%C3%BCddeutsche_Fu%C3%9Fballmeisterschaft_1901/02#/media/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        'http://de.wikipedia.org/wiki/S%C3%BCddeutsche_Fu%C3%9Fballmeisterschaft_1901/02#/media/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        '//de.wikipedia.org/wiki/S%C3%BCddeutsche_Fu%C3%9Fballmeisterschaft_1901/02#/media/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
        'de.wikipedia.org/wiki/S%C3%BCddeutsche_Fu%C3%9Fballmeisterschaft_1901/02#/media/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',

        // 'parameters other than title are ignored
        'https://de.wikipedia.org/w/index.php?title=File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg&uselang=de',
        'https://de.m.wikipedia.org/w/index.php?title=File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg&uselang=de',
        'http://de.wikipedia.org/w/index.php?title=File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg&uselang=de',
        '//de.wikipedia.org/w/index.php?title=File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg&uselang=de',
        'de.wikipedia.org/w/index.php?title=File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg&uselang=de',

        // parameters other than title are ignored
        'https://de.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg?foo=bar',
        'https://de.m.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg?foo=bar',
        'http://de.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg?foo=bar',
        '//de.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg?foo=bar',
        'de.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg?foo=bar',
      ],
    ],
    [
      // we give an article-url (not a file URL) and should give "no result" in all cases
      {},
      ['https://de.wikipedia.org/wiki/K%C3%B6nigsberg_in_Bayern'],
    ],
  ];

  inputs.forEach(normalizeExpectation => {
    const [expectedResult, inputUrls] = normalizeExpectation;

    describe(`for an input URL which normalizes to ${expectedResult.wikiUrl}`, () => {
      inputUrls.forEach(input => {
        it(`requesting info for ${input}`, async () => {
          const result = await fileData.getFileData(input);
          expect(result).toEqual(expectedResult);
        });
      });
    });
  });
});
