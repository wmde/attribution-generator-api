const Joi = require('joi');

const errors = {
  400: Joi.object()
    .description('Bad Request')
    .meta({ className: 'BadRequestErrorResponse' }),
  401: Joi.object()
    .description('Unauthorized')
    .meta({ className: 'UnauthorizedErrorResponse' }),
};

module.exports = { errors };
