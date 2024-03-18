const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.postUserHandler(request, h),
    options: {
      description: 'Create a new user',
      notes: 'This API endpoint is used to create a new user.',
      tags: ['api', 'auth'],
      validate: {
        payload: Joi.object({
          username: Joi.string().required().description('The username of the user'),
          password: Joi.string().required().description('The password of the user'),
          fullname: Joi.string().required().description('The full name of the user'),
        }).label('PostUsersPayload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
          data: Joi.object({
            id: Joi.string().required().description('The unique identifier of the user'),
            username: Joi.string().required().description('The username of the user'),
            fullname: Joi.string().required().description('The full name of the user'),
          }),
        }).label('PostUsersResponse'),
      },
    },
  },
]);

module.exports = routes;
