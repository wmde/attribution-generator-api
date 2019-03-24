const MatomoTracker = require('matomo-tracker');

const Tracker = require('./tracker');

jest.mock('matomo-tracker');

describe('Tracker', () => {
  const mockTracker = { track: jest.fn() };

  beforeEach(() => {
    MatomoTracker.mockImplementation(() => mockTracker);
  });

  afterEach(async () => {
    mockTracker.track.mockClear();
  });

  describe('track', () => {
    it('Uses the request URL as the URL to be tracked', () => {
      const tracker = new Tracker('tracker url', 123);

      const request = {
        server: {
          info: { protocol: 'http' },
        },
        info: { host: 'host.name' },
        url: { path: '/path/to/track' },
        headers: {},
      };

      tracker.track(request, 'foobar');

      expect(mockTracker.track).toHaveBeenCalledWith({
        url: 'http://host.name/path/to/track',
        action_name: expect.any(String),
      });
    });

    it('Uses the action name to be tracked', () => {
      const tracker = new Tracker('tracker url', 123);

      const request = {
        server: {
          info: { protocol: 'http' },
        },
        info: { host: 'host.name' },
        url: { path: '/path/to/track' },
        headers: {},
      };

      tracker.track(request, 'Test Action');

      expect(mockTracker.track).toHaveBeenCalledWith({
        url: expect.any(String),
        action_name: 'Test Action',
      });
    });

    it('Takes Do Not Track header into account', () => {
      const tracker = new Tracker('tracker url', 123);

      const request = {
        headers: { dnt: '1' },
      };

      tracker.track(request, 'foobar');

      expect(mockTracker.track).not.toHaveBeenCalled();
    });
  });
});
