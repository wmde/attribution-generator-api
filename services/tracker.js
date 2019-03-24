const MatomoTracker = require('matomo-tracker');

function doNotTrack(request) {
  if ('dnt' in request.headers && request.headers.dnt === '1') {
    return true;
  }
  if ('DNT' in request.headers && request.headers.DNT === '1') {
    return true;
  }
  return false;
}

class Tracker {
  constructor(matomoUrl, matomoSiteId) {
    this.matomo = new MatomoTracker(matomoSiteId, matomoUrl);
  }

  track(request, actionName) {
    if (doNotTrack(request)) {
      return;
    }

    const url = `${request.server.info.protocol}://${request.info.host}${request.url.path}`;

    this.matomo.track({
      url,
      action_name: actionName,
    });
  }
}

module.exports = Tracker;
