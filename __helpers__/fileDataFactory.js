function fileDataFactory({
  artistHtml = '<a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a> &amp; Musée Bolo',
  attributionHtml = 'Photograph by <a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a>, Wikimedia Commons, Cc-by-sa-2.0-fr',
  mediaType = 'BITMAP',
  rawUrl = 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Apple_Lisa2-IMG_1517.jpg',
  title = 'File:Apple_Lisa2-IMG_1517.jpg',
  wikiUrl = 'https://commons.wikimedia.org/',
}) {
  return {
    artistHtml,
    attributionHtml,
    mediaType,
    rawUrl,
    title,
    wikiUrl,
  };
}

module.exports = fileDataFactory;
