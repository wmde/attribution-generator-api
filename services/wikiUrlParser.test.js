const WikiUrlParser = require('./wikiUrlParser');
const testCases = require('./__test__/wikiUrls');


describe('parse()', () => {
  it('extracts title and wikiUrl from a wikipedia article url', async () => {
    const parser = new WikiUrlParser();
    const response = await parser.parse('https://en.wikipedia.org/wiki/Lower_Saxony')
    expect(response).toEqual({ title: 'Lower_Saxony', wikiUrl: 'https://en.wikipedia.org/' });
  });

  it.skip('parses urls properly', async () => {
    const parser = new WikiUrlParser();

    for( var i = 0; i < testCases.length; i++ ) {
      var testCase = testCases[ i ];

      for( var j = 0; j < testCase.input.length; j++ ) {
        const response = await parser.parse( testCase.input[ j ] );
        expect(response).toEqual({title: testCase.expected.file, wikiUrl: testCase.expected.wikiUrl} )
      }
    }
  });
});
