const Tracker = require('../services/tracker');

const matomoUrl = process.env.MATOMO_URL;
const matomoSiteId = process.env.MATOMO_SITE_ID;

module.exports = new Tracker(matomoUrl, matomoSiteId);
