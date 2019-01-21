const { Attribution } = require('../models/attribution');

function fileDataFactory({
  rawUrl = 'https://commons.wikimedia.org/wiki/File:Eisklettern_kl_engstligenfall.jpg',
  title = 'File:Eisklettern kl engstligenfall.jpg',
  artistHtml = '<a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a> &amp; Musée Bolo',
  attributionHtml = 'Photograph by <a href="//commons.wikimedia.org/wiki/User:Rama" title="User:Rama">Rama</a>, Wikimedia Commons, Cc-by-sa-2.0-fr',
}) {
  return {
    rawUrl,
    title,
    artistHtml,
    attributionHtml,
  };
}

module.exports = fileDataFactory;
