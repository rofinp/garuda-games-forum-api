const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    options: {
      handler: (request, h) => handler.postReplyHandler(request, h),
      auth: 'forumapi_jwt',
      description: 'Create a new reply',
      notes: 'This API endpoint is used to create a new reply for a comment',
      tags: ['api', 'replies'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().max(50).required(),
          commentId: Joi.string().max(50).required(),
        }).label('PostReplyParams'),
        payload: Joi.object({
          content: Joi.string().required().description('The content of the reply'),
        }).label('PostReplyPayload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
          data: Joi.object({
            addedReply: Joi.object({
              id: Joi.string().max(50).required().description('The unique identifier of the reply'),
              content: Joi.string().required().description('The content of the reply'),
              owner: Joi.string().max(50).required().description('The owner id of the reply'),
            }),
          }),
        }).label('PostReplyResponse'),
      },
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    options: {
      handler: (request) => handler.deleteReplyHandler(request),
      auth: 'forumapi_jwt',
      description: 'Soft delete a reply',
      notes: 'This API endpoint is used to soft delete a reply',
      tags: ['api', 'replies'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().max(50).required(),
          commentId: Joi.string().max(50).required(),
          replyId: Joi.string().max(50).required(),
        }).label('DeleteReplyParams'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
        }).label('DeleteReplyResponse'),
      },
    },
  },
]);

module.exports = routes;
