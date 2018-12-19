const assert = require('assert');

class WikiUrlParser {
  // TODO: needs client
  // needs other name
  parse(url) {
    // TODO: assert the url is a url
    // and the url should be a wiki url
    const pageUrl = decodeURI(url);
    return this.getWikipediaPageImagesFileInfo( pageUrl );

	}

	async getWikipediaPageImagesFileInfo( pageUrl ) {
		const { title, wikiUrl } = await this.splitUrl( pageUrl );
    // const wikiUrl = urlInfo.wikiUrl;
    // const { prefixedFilenameOrImageInfos, url } = await this.client.getWikipediaPageImageInfo( decodeURI( urlInfo.title ), wikiUrl );

    // const evaluatedUrlInfo = await this.splitUrl( url );
    // // TODO: investigate this case:
    // if( evaluatedUrlInfo.wikiUrl !== wikiUrl ) {
    //   return { title: evaluatedUrlInfo.title, wikiUrl: evaluatedUrlInfo.wikiUrl };
    // } else {
    //   return { title: prefixedFilenameOrImageInfos, wikiUrl };
    // }
    return { title, wikiUrl };
	}

	async splitUrl( url ) {
		// const regExp0 = /upload.wikimedia\.org\/wikipedia\/([-a-z]{2,})\//i;
		const regExp1 = /([-a-z]{2,})(\.m)?\.wikipedia\.org\//i;
		const regExp2 = /\/wikipedia\/([^/]+)\//;
		let matches;
		let wikiUrl;

		// if( url.indexOf( 'commons.wikimedia.org/' ) !== -1 || url.indexOf( 'commons.m.wikimedia.org/' ) !== -1 ) {
		// 	wikiUrl = 'https://commons.wikimedia.org/';
		// 	const title = await this.extractPageTitle( url )
      // return { wikiUrl, title };
		// }

		// if( regExp0.test( url ) ) {
		// 	matches = url.match( regExp0 );
		// 	const domain = ( matches[ 1 ] === 'commons' ) ? 'wikimedia' : 'wikipedia';
		// 	wikiUrl = 'https://' + matches[ 1 ] + '.' + domain + '.org/';
		// 	const title = await this.extractPageTitle( url );
      // return { wikiUrl, title };
		// }

		if( regExp1.test( url ) ) {
			matches = url.match( regExp1 );
			wikiUrl = 'https://' + matches[ 1 ] + '.wikipedia.org/';

			const title = await this.extractPageTitle( url, wikiUrl, false );
      return { wikiUrl, title };
		}

		if( regExp2.test( url ) ) {
			matches = url.match( regExp2 );
			wikiUrl = 'https://' + matches[ 1 ] + '.wikipedia.org/';
			const title = await this.extractPageTitle( url )
      return { wikiUrl, title };
		}
	}


	async extractPageTitle( url, wikiUrl, forcePrefix = true ) {
		const filename = await this.extractFilename( url, wikiUrl );
    let prefixedFilename = decodeURIComponent( filename );
    if( prefixedFilename.indexOf( ':' ) === -1 && forcePrefix ) {
      prefixedFilename = 'File:' + prefixedFilename;
    }

    return  prefixedFilename;
	}

	async extractFilename( url, wikiUrl ) {
		let key;
		let keyLoc;
		let matches;
		let segments;
		let pageId;

    // TODO: curid is a wikimedia internal thing
    // we need to support this as well
		// if( url.indexOf( 'curid=' ) !== -1 ) {
		// 	matches = url.match( /curid=([^&=]+)/i );
		// 	pageId = matches[ 1 ];
		// 	const title = await this.client.getTitleFromPageId( pageId, wikiUrl )
      // return title
		// }

		if( url.indexOf( 'title=' ) !== -1 ) {
			matches = url.match( /title=([^&]+)/i );
      return matches[ 1 ];
		}
		url = url.replace( /\?.+$/, '' );

		key = '#mediaviewer/';
		keyLoc = url.indexOf( key );

		if( keyLoc !== -1 ) {
			return url.substr( keyLoc + key.length );
		}

		key = '#/media/';
		keyLoc = url.indexOf( key );

		if( keyLoc !== -1 ) {
			return url.substr( keyLoc + key.length );
		}

		key = 'wiki/';
		keyLoc = url.indexOf( key );

		if( keyLoc !== -1 ) {
			return url.substr( keyLoc + key.length );
		}

		segments = url.split( '/' );
    if (segments.includes('thumb')) {
			return segments[ segments.length - 2 ];
		} else {
			return segments[ segments.length - 1 ];
		}
	}
}

module.exports = WikiUrlParser;
