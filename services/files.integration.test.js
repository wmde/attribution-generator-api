const Files = require('./files');
const Client = require('./util/client');

// NOTE: this is a tmp integration test to easify development
// we probably do not want to run this by default in the future
// (only on CI maybe)
describe('getPageImages()', () => {
  const client = new Client();
  const service = new Files({ client });
  const url = 'https://de.wikipedia.org/wiki/The_Hellacopters';
  const expectedFiles = [
    {
      title: 'Datei:Backyard babies 02.jpg',
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:Backyard_babies_02.jpg',
      rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Backyard_babies_02.jpg',
      fileSize: 112450,
      thumbnail: {
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Backyard_babies_02.jpg/300px-Backyard_babies_02.jpg',
        width: 300,
        height: 300,
      },
    },
    {
      title: 'Datei:Commons-logo.svg',
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:Commons-logo.svg',
      rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Commons-logo.svg',
      fileSize: 932,
      thumbnail: {
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Commons-logo.svg/300px-Commons-logo.svg.png',
        width: 300,
        height: 403,
      },
    },
    {
      title: 'Datei:ImperialStateElectric Sonisphere2010.jpg',
      descriptionUrl:
        'https://commons.wikimedia.org/wiki/File:ImperialStateElectric_Sonisphere2010.jpg',
      rawUrl:
        'https://upload.wikimedia.org/wikipedia/commons/8/86/ImperialStateElectric_Sonisphere2010.jpg',
      fileSize: 1168631,
      thumbnail: {
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/ImperialStateElectric_Sonisphere2010.jpg/300px-ImperialStateElectric_Sonisphere2010.jpg',
        width: 300,
        height: 225,
      },
    },
    {
      title: 'Datei:Nick royale and strings.jpg',
      descriptionUrl: 'https://commons.wikimedia.org/wiki/File:Nick_royale_and_strings.jpg',
      rawUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Nick_royale_and_strings.jpg',
      fileSize: 3068651,
      thumbnail: {
        rawUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Nick_royale_and_strings.jpg/300px-Nick_royale_and_strings.jpg',
        width: 300,
        height: 199,
      },
    },
  ];

  it('returns all images with their name and url', async () => {
    const response = await service.getPageImages(url);

    expect(response).toEqual(expectedFiles);
  });
});
