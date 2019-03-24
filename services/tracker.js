const MatomoTracker = require('matomo-tracker');

class Tracker {
  constructor(matomoUrl, matomoSiteId) {
    this.matomo = new MatomoTracker(matomoSiteId, matomoUrl);
  }

  track(request, actionName) {
    const url = `${request.server.info.protocol}://${request.info.host}${request.url.path}`;
    this.matomo.track({
      url,
      action_name: actionName,
    });
  }
}

module.exports = Tracker;
