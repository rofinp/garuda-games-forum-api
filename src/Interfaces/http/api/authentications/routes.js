const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/authentications',
    options: {
      handler: (request, h) => handler.postAuthenticationHandler(request, h),
      description: 'Create a new authentication (login)',
      notes: 'This API endpoint is used to authenticate a user and generate access and refresh tokens.',
      tags: ['api', 'authentications'],
      validate: {
        payload: Joi.object({
          username: Joi.string().required().description('The username of the user'),
          password: Joi.string().required().description('The password of the user'),
        }).label('PostAuthenticationPayload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
          data: Joi.object({
            accessToken: Joi.string().required().description('The access token for the authenticated user'),
            refreshToken: Joi.string().required().description('The refresh token for the authenticated user'),
          }),
        }).label('PostAuthenticationResponse'),
      },
    },
  },
  {
    method: 'PUT',
    path: '/authentications',
    options: {
      handler: (request) => handler.putAuthenticationHandler(request),
      description: 'Refresh access token using refresh token',
      notes: 'This API endpoint is used to refresh the access token using a valid refresh token.',
      tags: ['api', 'authentications'],
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required().description('The refresh token of the user'),
        }).label('PutAuthenticationPayload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
          data: Joi.object({
            accessToken: Joi.string().required().description('The refreshed access token for the user'),
          }),
        }).label('PutAuthenticationResponse'),
      },
    },
  },
  {
    method: 'DELETE',
    path: '/authentications',
    options: {
      handler: (request) => handler.deleteAuthenticationHandler(request),
      description: 'Revoke authentication (logout)',
      notes: 'This API endpoint is used to revoke the authentication session, effectively logging the user out.',
      tags: ['api', 'authentications'],
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required().description('The refresh token of the user to be revoked'),
        }).label('DeleteAuthenticationPayload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
        }).label('DeleteAuthenticationResponse'),
      },
    },
  },
]);

module.exports = routes;
