const Files = require('./files');
const Client = require('./util/client');

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
  const expectedFiles = [
    {
      title: 'Datei:Baumeister-Königsberg.JPG',
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:Baumeister-K%C3%B6nigsberg.JPG',
      fileSize: 357387,
      rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Baumeister-K%C3%B6nigsberg.JPG',
      thumbnail: {
        height: 400,
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Baumeister-K%C3%B6nigsberg.JPG/300px-Baumeister-K%C3%B6nigsberg.JPG',
        width: 300,
      },
    },
    {
      title: 'Datei:Commons-logo.svg',
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:Commons-logo.svg',
      fileSize: 932,
      rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Commons-logo.svg',
      thumbnail: {
        height: 403,
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Commons-logo.svg/300px-Commons-logo.svg.png',
        width: 300,
      },
    },
    {
      title: 'Datei:DEU Königsberg COA.svg',
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:DEU_K%C3%B6nigsberg_COA.svg',
      fileSize: 38875,
      rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/DEU_K%C3%B6nigsberg_COA.svg',
      thumbnail: {
        height: 346,
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/DEU_K%C3%B6nigsberg_COA.svg/300px-DEU_K%C3%B6nigsberg_COA.svg.png',
        width: 300,
      },
    },
    {
      title: 'Datei:Germany adm location map.svg',
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:Germany_adm_location_map.svg',
      fileSize: 657974,
      rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Germany_adm_location_map.svg',
      thumbnail: {
        height: 356,
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Germany_adm_location_map.svg/300px-Germany_adm_location_map.svg.png',
        width: 300,
      },
    },
    {
      title: 'Datei:Karte-HSC-Ex.png',
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:Karte-HSC-Ex.png',
      fileSize: 32503,
      rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Karte-HSC-Ex.png',
      thumbnail: {
        height: 254,
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Karte-HSC-Ex.png/300px-Karte-HSC-Ex.png',
        width: 300,
      },
    },
    {
      title: 'Datei:Konigsberg Altstadt-1.jpg',
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:Konigsberg_Altstadt-1.jpg',
      fileSize: 78351,
      rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Konigsberg_Altstadt-1.jpg',
      thumbnail: {
        height: 231,
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Konigsberg_Altstadt-1.jpg/300px-Konigsberg_Altstadt-1.jpg',
        width: 300,
      },
    },
    {
      title: 'Datei:Konigsberg Altstadt-2.jpg',
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:Konigsberg_Altstadt-2.jpg',
      fileSize: 60336,
      rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Konigsberg_Altstadt-2.jpg',
      thumbnail: {
        height: 231,
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Konigsberg_Altstadt-2.jpg/300px-Konigsberg_Altstadt-2.jpg',
        width: 300,
      },
    },
    {
      title: 'Datei:Königsberg Altershausen.jpg',
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:K%C3%B6nigsberg_Altershausen.jpg',
      fileSize: 4931020,
      rawUrl:
        'https://upload.wikimedia.org/wikipedia/commons/1/12/K%C3%B6nigsberg_Altershausen.jpg',
      thumbnail: {
        height: 225,
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/K%C3%B6nigsberg_Altershausen.jpg/300px-K%C3%B6nigsberg_Altershausen.jpg',
        width: 300,
      },
    },
    {
      title: 'Datei:Königsberg Bühl.jpg',
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:K%C3%B6nigsberg_B%C3%BChl.jpg',
      fileSize: 4667382,
      rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/K%C3%B6nigsberg_B%C3%BChl.jpg',
      thumbnail: {
        height: 225,
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/K%C3%B6nigsberg_B%C3%BChl.jpg/300px-K%C3%B6nigsberg_B%C3%BChl.jpg',
        width: 300,
      },
    },
    {
      title: 'Datei:Königsberg Dörflis.jpg',
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:K%C3%B6nigsberg_D%C3%B6rflis.jpg',
      fileSize: 4670674,
      rawUrl:
        'https://upload.wikimedia.org/wikipedia/commons/a/a3/K%C3%B6nigsberg_D%C3%B6rflis.jpg',
      thumbnail: {
        height: 400,
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/K%C3%B6nigsberg_D%C3%B6rflis.jpg/300px-K%C3%B6nigsberg_D%C3%B6rflis.jpg',
        width: 300,
      },
    },
  ];

  urls.forEach(url => {
    it(`when requesting files for "${url}"`, async () => {
      const response = await service.getPageImages(url);
      expect(response).toEqual(expectedFiles);
    });
  });
});
