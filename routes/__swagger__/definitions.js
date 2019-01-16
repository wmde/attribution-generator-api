const Joi = require('joi');

const errors = {
  400: Joi.object()
    .description('Bad Request')
    .meta({ className: 'BadRequestErrorResponse' }),
  401: Joi.object()
    .description('Unauthorized')
    .meta({ className: 'UnauthorizedErrorResponse' }),
  422: Joi.object()
    .description('Unprocessable Entity')
    .meta({ className: 'UnprocessableEntityErrorResponse' }),
  500: Joi.object()
    .description('Internal Server Error')
    .meta({ className: 'InternalServerError' }),
  503: Joi.object()
    .description('Service Unavailable')
    .meta({ className: 'ServiceUnavailableErrorResponse' }),
};

module.exports = { errors };
