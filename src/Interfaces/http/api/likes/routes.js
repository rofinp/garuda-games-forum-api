const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/likes',
    options: {
      handler: (request, h) => handler.putThreadLikeHandler(request, h),
      auth: 'forumapi_jwt',
      plugins: {
        'hapi-swagger': {
          description: 'Add or delete a like for a thread',
          notes: 'This API endpoint is used to add or delete a like for a thread.',
          tags: ['api', 'likes', 'threads'],
          response: {
            schema: Joi.object({
              status: Joi.string().valid('success').required(),
            }).label('PutThreadLikesResponse'),
          },
        },
      },
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    options: {
      handler: (request, h) => handler.putCommentLikeHandler(request, h),
      auth: 'forumapi_jwt',
      plugins: {
        'hapi-swagger': {
          description: 'Add or delete a like for a comment',
          notes: 'This API endpoint is used to add or delete a like for a comment.',
          tags: ['api', 'likes', 'comments'],
          response: {
            schema: Joi.object({
              status: Joi.string().valid('success').required(),
            }).label('PutCommentLikesResponse'),
          },
        },
      },
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}/likes',
    options: {
      handler: (request, h) => handler.putReplyLikeHandler(request, h),
      auth: 'forumapi_jwt',
      plugins: {
        'hapi-swagger': {
          description: 'Add or delete a like for a reply',
          notes: 'This API endpoint is used to add or delete a like for a reply.',
          tags: ['api', 'likes', 'replies'],
          response: {
            schema: Joi.object({
              status: Joi.string().valid('success').required(),
            }).label('PutReplyLikesResponse'),
          },
        },
      },
    },
  },
]);

module.exports = routes;
