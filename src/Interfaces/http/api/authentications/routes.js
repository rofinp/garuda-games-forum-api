const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/authentications',
    handler: (request, h) => handler.postAuthenticationHandler(request, h),
    options: {
      description: 'Create a new authentication (login)',
      notes: 'This API endpoint is used to authenticate a user and generate access and refresh tokens.',
      tags: ['api', 'auth'],
      validate: {
        payload: Joi.object({
          username: Joi.string().required().description('The username of the user'),
          password: Joi.string().required().description('The password of the user'),
        }).label('PostAuthenticationsPayload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
          data: Joi.object({
            accessToken: Joi.string().required().description('The access token for the authenticated user'),
            refreshToken: Joi.string().required().description('The refresh token for the authenticated user'),
          }),
        }).label('PostAuthenticationsResponse'),
      },
    },
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (request) => handler.putAuthenticationHandler(request),
    options: {
      description: 'Refresh access token using refresh token',
      notes: 'This API endpoint is used to refresh the access token using a valid refresh token.',
      tags: ['api', 'auth'],
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required().description('The refresh token of the user'),
        }).label('PutAuthenticationsPayload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
          data: Joi.object({
            accessToken: Joi.string().required().description('The refreshed access token for the user'),
          }),
        }).label('PutAuthenticationsResponse'),
      },
    },
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (request) => handler.deleteAuthenticationHandler(request),
    options: {
      description: 'Revoke authentication (logout)',
      notes: 'This API endpoint is used to revoke the authentication session, effectively logging the user out.',
      tags: ['api', 'auth'],
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required().description('The refresh token of the user to be revoked'),
        }).label('DeleteAuthenticationsPayload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
        }).label('DeleteAuthenticationsResponse'),
      },
    },
  },
]);

module.exports = routes;
