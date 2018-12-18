const routes = [];

const mockResponse = [
  {
    "code": "CC BY-SA 3.0",
    "url": "https://creativecommons.org/licenses/by-sa/3.0/legalcode"
  },
];

routes.push({
  path: '/licenses',
  method: 'GET',
  options: {},
  handler: async (request, h) => {
    return h.response(mockResponse);
  },
});

module.exports = routes;
