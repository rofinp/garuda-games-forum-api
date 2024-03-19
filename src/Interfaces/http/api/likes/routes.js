const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/likes',
    options: {
      handler: (request, h) => handler.putThreadLikeHandler(request, h),
      auth: 'forumapi_jwt',
      description: 'Add or delete a like for a thread',
      notes: 'This API endpoint is used to add or delete a like for a thread.',
      tags: ['api', 'likes', 'threads'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().required(),
        }).label('PutLikeParams'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
        }).label('PutLikeResponse'),
      },
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    options: {
      handler: (request, h) => handler.putCommentLikeHandler(request, h),
      auth: 'forumapi_jwt',
      description: 'Add or delete a like for a comment',
      notes: 'This API endpoint is used to add or delete a like for a comment.',
      tags: ['api', 'likes', 'comments'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().required(),
          commentId: Joi.string().required(),
        }).label('PutLikeParams'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
        }).label('PutLikeResponse'),
      },
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}/likes',
    options: {
      handler: (request, h) => handler.putReplyLikeHandler(request, h),
      auth: 'forumapi_jwt',
      description: 'Add or delete a like for a reply',
      notes: 'This API endpoint is used to add or delete a like for a reply.',
      tags: ['api', 'likes', 'replies'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().required(),
          commentId: Joi.string().required(),
          replyId: Joi.string().required(),
        }).label('PutLikeParams'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
        }).label('PutLikeResponse'),
      },
    },
  },
]);

module.exports = routes;
