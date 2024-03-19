const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    options: {
      handler: (request, h) => handler.postCommentHandler(request, h),
      auth: 'forumapi_jwt',
      plugins: {
        'hapi-swagger': {
          description: 'Create a new comment for a thread',
          notes: 'This API endpoint is used to create a new comment for a thread.',
          tags: ['api', 'comments'],
          validate: {
            payload: Joi.object({
              content: Joi.string().required().description('The content of the comment'),
            }).label('PostCommentsPayload'),
          },
          response: {
            schema: Joi.object({
              status: Joi.string().valid('success').required(),
              data: Joi.object({
                id: Joi.string().required().description('The unique identifier of the comment'),
                content: Joi.string().required().description('The content of the comment'),
                owner: Joi.string().required().description('The owner of the comment'),
              }),
            }).label('PostCommentsResponse'),
          },
        },
      },
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    options: {
      handler: (request) => handler.deleteCommentHandler(request),
      auth: 'forumapi_jwt',
      plugins: {
        'hapi-swagger': {
          description: 'Soft delete a comment from a thread',
          notes: 'This API endpoint is used to soft delete a comment from a thread.',
          tags: ['api', 'comments'],
          response: {
            schema: Joi.object({
              status: Joi.string().valid('success').required(),
            }).label('DeleteCommentResponse'),
          },
        },
      },
    },
  },
]);

module.exports = routes;
