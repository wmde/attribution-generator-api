const examples = [
	{
		input: [
			'https://commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg',
			'commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg',
			'https://commons.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg',
			'https://upload.wikimedia.org/wikipedia/commons/8/84/Helene_Fischer_2010.jpg',
			'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Helene_Fischer_2010.jpg/171px-Helene_Fischer_2010.jpg',
			'upload.wikimedia.org/wikipedia/commons/thumb/8/84/Helene_Fischer_2010.jpg/171px-Helene_Fischer_2010.jpg',
			'https://commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg#mediaviewer/File:Helene_Fischer_2010.jpg',
			'commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg?uselang=de',
			'https://commons.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg&uselang=de',
			'commons.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg?foo=bar',
			'https://commons.m.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg',
			'commons.m.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg',
			'https://commons.m.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg',
			'commons.m.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg?uselang=de',
			'https://commons.m.wikimedia.org/w/index.php?title=File:Helene_Fischer_2010.jpg&uselang=de',
			'commons.m.wikimedia.org/wiki/File:Helene_Fischer_2010.jpg?foo=bar',
			// 'https://commons.wikimedia.org/?curid=15382769',
			// 'commons.wikimedia.org/?curid=15382769',
			// 'https://commons.m.wikimedia.org/?curid=15382769',
			// 'commons.m.wikimedia.org/?curid=15382769'
		],
		expected: {
			file: 'File:Helene_Fischer_2010.jpg',
			wikiUrl: 'https://commons.wikimedia.org/'
		}
	}, {
		input: [
			'https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Le_Bistro/24_f%C3%A9vrier_2012#mediaviewer/Fichier:Helene_Fischer_2010.jpg'
		],
		expected: {
			file: 'File:Helene_Fischer_2010.jpg',
			wikiUrl: 'https://commons.wikimedia.org/'
		}
	}, {
		input: [
			'https://commons.wikimedia.org/wiki/File:JapaneseToiletControlPanel.jpg',
			'https://commons.wikimedia.org/w/index.php?title=File:JapaneseToiletControlPanel.jpg',
			'https://upload.wikimedia.org/wikipedia/commons/e/e4/JapaneseToiletControlPanel.jpg',
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/JapaneseToiletControlPanel.jpg/320px-JapaneseToiletControlPanel.jpg',
			'https://commons.wikimedia.org/wiki/File:JapaneseToiletControlPanel.jpg#mediaviewer/File:JapaneseToiletControlPanel.jpg',
			'https://commons.wikimedia.org/wiki/User:Chris_73/Gallery_001#mediaviewer/File:JapaneseToiletControlPanel.jpg',
			'https://commons.m.wikimedia.org/wiki/File:JapaneseToiletControlPanel.jpg',
			'https://commons.m.wikimedia.org/w/index.php?title=File:JapaneseToiletControlPanel.jpg',
			// 'https://commons.wikimedia.org/?curid=10391',
			// 'commons.wikimedia.org/?curid=10391',
			// 'https://commons.m.wikimedia.org/?curid=10391',
			// 'commons.m.wikimedia.org/?curid=10391'
		],
		expected: {
			file: 'File:JapaneseToiletControlPanel.jpg',
			wikiUrl: 'https://commons.wikimedia.org/'
		}
	}, {
		input: [
			'https://commons.wikimedia.org/wiki/File:Gerardus_t%27_Hooft_at_Harvard.jpg',
			'https://commons.wikimedia.org/w/index.php?title=File:Gerardus_t%27_Hooft_at_Harvard.jpg',
			'https://upload.wikimedia.org/wikipedia/commons/f/f4/Gerardus_t%27_Hooft_at_Harvard.jpg',
			'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Gerardus_t%27_Hooft_at_Harvard.jpg/180px-Gerardus_t%27_Hooft_at_Harvard.jpg',
			'https://commons.wikimedia.org/wiki/File:Gerardus_t%27_Hooft_at_Harvard.jpg#mediaviewer/File:Gerardus_t%27_Hooft_at_Harvard.jpg',
			'https://commons.wikimedia.org/wiki/Gerardus_%27t_Hooft#mediaviewer/File:Gerardus_t%27_Hooft_at_Harvard.jpg',
			'https://commons.m.wikimedia.org/wiki/File:Gerardus_t%27_Hooft_at_Harvard.jpg',
			'https://commons.m.wikimedia.org/w/index.php?title=File:Gerardus_t%27_Hooft_at_Harvard.jpg',
			// 'https://commons.wikimedia.org/?curid=118613',
			// 'commons.wikimedia.org/?curid=118613',
			// 'https://commons.m.wikimedia.org/?curid=118613',
			// 'commons.m.wikimedia.org/?curid=118613'
		],
		expected: {
			file: 'File:Gerardus_t\'_Hooft_at_Harvard.jpg',
			wikiUrl: 'https://commons.wikimedia.org/'
		}
	}, {
		input: [
			'https://de.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'de.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'https://de.wikipedia.org/w/index.php?title=File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'https://upload.wikimedia.org/wikipedia/de/f/fb/1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'https://upload.wikimedia.org/wikipedia/de/thumb/f/fb/1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg/320px-1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'upload.wikimedia.org/wikipedia/de/thumb/f/fb/1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg/320px-1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'https://upload.wikimedia.org/wikipedia/de/thumb/f/fb/1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg/320px-1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'https://de.m.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'de.m.wikipedia.org/wiki/File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'https://de.m.wikipedia.org/w/index.php?title=File:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg'
		],
		expected: {
			file: 'File:1_FC_Bamberg_-_1_FC_Nürnberg_1901.jpg',
			wikiUrl: 'https://de.wikipedia.org/'
		}
	}, {
		input: [
			'https://de.wikipedia.org/wiki/Datei:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'de.wikipedia.org/wiki/Datei:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'https://de.wikipedia.org/w/index.php?title=Datei:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'de.wikipedia.org/w/index.php?title=Datei:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'https://de.wikipedia.org/wiki/1._FC_Bamberg#mediaviewer/Datei:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'https://de.wikipedia.org/wiki/Datei:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg#mediaviewer/Datei:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'https://de.m.wikipedia.org/wiki/Datei:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'de.m.wikipedia.org/wiki/Datei:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'https://de.m.wikipedia.org/w/index.php?title=Datei:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg',
			'de.m.wikipedia.org/w/index.php?title=Datei:1_FC_Bamberg_-_1_FC_N%C3%BCrnberg_1901.jpg'
		],
		expected: {
			file: 'Datei:1_FC_Bamberg_-_1_FC_Nürnberg_1901.jpg',
			wikiUrl: 'https://de.wikipedia.org/'
		}
	}, {
		input: [
			'https://de.wikipedia.org/wiki/Commodore_Plus/4#/media/File:Commodore_Plus_4_Knurri.png'
		],
		expected: {
			file: 'File:Commodore_Plus_4_Knurri.png',
			wikiUrl: 'https://commons.wikimedia.org/'
		}
	}, {
		input: [
			'https://commons.wikimedia.org/wiki/File:A_Punjab_Village,_1925.webm',
			'https://commons.m.wikimedia.org/wiki/File:A_Punjab_Village,_1925.webm',
			// 'https://commons.wikimedia.org/?curid=45093094',
			// 'https://commons.m.wikimedia.org/?curid=45093094'
		],
		expected: {
			file: 'File:A_Punjab_Village,_1925.webm',
			wikiUrl: 'https://commons.wikimedia.org/'
		}
	}
];

module.exports =  examples;
