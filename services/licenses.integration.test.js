const Licenses = require('./licenses');

// NOTE: this is a tmp integration test to easify development
// we probably do not want to run this by default in the future
// (only on CI maybe)
describe('getLicenseForFile', () => {
  const service = new Licenses();
  const title = 'File:Apple_Lisa.jpg';
  const wikiUrl = 'https://commons.wikimedia.org/';

  it('works', async () => {
    const response = await service.getPageTemplates(title, wikiUrl);
    expect(response).toMatchObject({id: "cc-by-sa-3.0", name: "CC BY-SA 3.0"})
    // expect(response).toEqual([
    //   "Template:CC-Layout",
    //   "Template:Cc-by-sa-3.0-migrated",
    //   "Template:Description",
    //   "Template:Dir",
    //   "Template:En",
    //   "Template:Es",
    //   "Template:Fr",
    //   "Template:GFDL",
    //   "Template:GNU-Layout",
    //   "Template:License migration",
    //   "Template:License migration complete",
    //   "Template:License template tag",
    //   "Template:Original upload log",
    // ]);
  });
});
