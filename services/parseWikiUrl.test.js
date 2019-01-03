const parse = require('./parseWikiUrl');

// according to https://en.wikipedia.org/wiki/Help:URL#URLs_of_Wikipedia_pages
// and some upload urls
const cases = [
  {
    name: 'plain article url',
    url: 'https://en.wikipedia.org/wiki/Lower_Saxony',
    expected: {
      title: 'Lower_Saxony',
      wikiUrl: 'https://en.wikipedia.org/',
    },
  },
  {
    name: 'mobile plain article url',
    url: 'https://en.m.wikipedia.org/wiki/Lower_Saxony',
    expected: {
      title: 'Lower_Saxony',
      wikiUrl: 'https://en.wikipedia.org/',
    },
  },
  {
    name: 'parameterized article url',
    url: 'https://de.wikipedia.org/w/index.php?title=Pommes_frites',
    expected: {
      title: 'Pommes_frites',
      wikiUrl: 'https://de.wikipedia.org/',
    },
  },
  {
    name: 'prefixed article url',
    url: 'https://en.wikipedia.org/wiki/Help:URL',
    expected: {
      title: 'Help:URL',
      wikiUrl: 'https://en.wikipedia.org/',
    },
  },
  {
    name: 'parameterized & prefixed article url',
    url: 'https://en.wikipedia.org/w/index.php?title=Help:URL',
    expected: {
      title: 'Help:URL',
      wikiUrl: 'https://en.wikipedia.org/',
    },
  },
  {
    name: 'url with #media fragment',
    url: 'https://nl.wikipedia.org/wiki/Friet#/media/File:Fries_2.jpg',
    expected: {
      title: 'File:Fries_2.jpg',
      wikiUrl: 'https://nl.wikipedia.org/',
    },
  },
  {
    name: 'url with #mediaviewer fragment',
    url: 'https://en.wikipedia.org/wiki/Soil#mediaviewer/File:SoilTexture_USDA.png',
    expected: {
      title: 'File:SoilTexture_USDA.png',
      wikiUrl: 'https://en.wikipedia.org/',
    },
  },
  {
    name: 'upload url',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Helene_Fischer_2010.jpg',
    expected: {
      title: 'File:Helene_Fischer_2010.jpg',
      wikiUrl: 'https://commons.wikimedia.org/',
    },
  },
  {
    name: 'upload url thumbnail',
    url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Helene_Fischer_2010.jpg/171px-Helene_Fischer_2010.jpg',
    expected: {
      title: 'File:Helene_Fischer_2010.jpg',
      wikiUrl: 'https://commons.wikimedia.org/',
    },
  },
];

describe('parse()', () => {
  cases.forEach(({ name, url, expected }) => {
    it(`extracts title and wikiUrl from ${name}`, () => {
      expect(parse(url)).toEqual(expected);
    });
  });

  it('returns nothing for non-wiki url', () => {
    const url = 'https://en.pokepedia.org/wiki/Lower_Saxony';
    expect(parse(url)).toEqual(null);
  });
});
