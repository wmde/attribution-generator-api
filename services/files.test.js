const Files = require('./files');

describe('getPageImages()', () => {
  const service = new Files();
  const title = 'The_Hellacopters';
  const wikiUrl = 'https://de.wikipedia.org';
  const expectedFiles = [
    {
      title: 'Datei:Backyard babies 02.jpg',
      url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Backyard_babies_02.jpg',
    },
    {
      title: 'Datei:Commons-logo.svg',
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Commons-logo.svg',
    },
    {
      title: 'Datei:ImperialStateElectric Sonisphere2010.jpg',
      url:
        'https://upload.wikimedia.org/wikipedia/commons/8/86/ImperialStateElectric_Sonisphere2010.jpg',
    },
    {
      title: 'Datei:Nick royale and strings.jpg',
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Nick_royale_and_strings.jpg',
    },
  ];

  it('returns all images with their name and url', async () => {
    const response = await service.getPageImages(title, wikiUrl);

    expect(response).toEqual(expectedFiles);
  });
});
