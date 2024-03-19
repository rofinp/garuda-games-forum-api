const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    options: {
      handler: (request, h) => handler.postReplyHandler(request, h),
      auth: 'forumapi_jwt',
      plugins: {
        'hapi-swagger': {
          description: 'Create a new reply',
          notes: 'This API endpoint is used to create a new reply for a comment',
          tags: ['api', 'replies'],
          validate: {
            payload: Joi.object({
              content: Joi.string().required().description('The content of the reply'),
            }).label('PostRepliesPayload'),
          },
          response: {
            schema: Joi.object({
              status: Joi.string().valid('success').required(),
              data: Joi.object({
                id: Joi.string().required().description('The unique identifier of the reply'),
                content: Joi.string().required().description('The content of the reply'),
                owner: Joi.string().required().description('The owner of the reply'),
              }),
            }).label('PostRepliesResponse'),
          },
        },
      },
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    options: {
      handler: (request) => handler.deleteReplyHandler(request),
      auth: 'forumapi_jwt',
      plugins: {
        'hapi-swagger': {
          description: 'Soft delete a reply',
          notes: 'This API endpoint is used to soft delete a reply',
          tags: ['api', 'replies'],
          response: {
            schema: Joi.object({
              status: Joi.string().valid('success').required(),
            }).label('DeleteRepliesResponse'),
          },
        },
      },
    },
  },
]);

module.exports = routes;
