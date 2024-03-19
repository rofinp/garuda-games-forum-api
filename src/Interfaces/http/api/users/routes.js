const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/users',
    options: {
      handler: (request, h) => handler.postUserHandler(request, h),
      description: 'Create a new user',
      notes: 'This API endpoint is used to create a new user.',
      tags: ['api', 'users'],
      validate: {
        payload: Joi.object({
          username: Joi.string().pattern(/^[\w]+$/).max(50).required()
            .description('The username of the user'),
          password: Joi.string().required().description('The password of the user'),
          fullname: Joi.string().required().description('The full name of the user'),
        }).label('PostUserPayload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
          data: Joi.object({
            addedUser: Joi.object({
              id: Joi.string().max(50).required().description('The unique identifier of the user'),
              username: Joi.string().required().description('The username of the user'),
              fullname: Joi.string().required().description('The full name of the user'),
            }),
          }),
        }).label('PostUserResponse'),
      },
    },
  },
]);

module.exports = routes;
