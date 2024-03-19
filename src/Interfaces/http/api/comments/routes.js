const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    options: {
      handler: (request, h) => handler.postCommentHandler(request, h),
      auth: 'forumapi_jwt',
      description: 'Create a new comment for a thread',
      notes: 'This API endpoint is used to create a new comment for a thread.',
      tags: ['api', 'comments'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().max(50).required(),
        }).label('PostCommentParams'),
        payload: Joi.object({
          content: Joi.string().required().description('The content of the comment'),
        }).label('PostCommentPayload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
          data: Joi.object({
            addedComment: Joi.object({
              id: Joi.string().max(50).required().description('The unique identifier of the comment'),
              content: Joi.string().required().description('The content of the comment'),
              owner: Joi.string().max(50).required().description('The owner id of the comment'),
            }),
          }),
        }).label('PostCommentResponse'),
      },
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    options: {
      handler: (request) => handler.deleteCommentHandler(request),
      auth: 'forumapi_jwt',
      description: 'Soft delete a comment from a thread',
      notes: 'This API endpoint is used to soft delete a comment from a thread.',
      tags: ['api', 'comments'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().max(50).required(),
          commentId: Joi.string().max(50).required(),
        }).label('DeleteCommentParams'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
        }).label('DeleteCommentResponse'),
      },
    },
  },
]);

module.exports = routes;
