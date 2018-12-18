const routes = [];

const mockResponse = [
  {
    code: 'CC BY-SA 3.0',
    url: 'https://creativecommons.org/licenses/by-sa/3.0/legalcode',
  },
];

routes.push({
  path: '/licenses',
  method: 'GET',
  options: {
    description: 'Licenses Index',
    notes: 'Returns a List of all Licenses',
  },
  handler: async (request, h) => h.response(mockResponse),
});

routes.push({
  path: '/license/{file}',
  method: 'GET',
  options: {
    description: 'Image License',
    notes: 'Returns the most liberal license for the given image',
  },
  handler: async (request, h) => h.response(mockResponse[0]),
});

module.exports = routes;
