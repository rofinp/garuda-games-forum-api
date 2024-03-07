const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/likes',
    handler: (request, h) => handler.putThreadLikeHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: (request, h) => handler.putCommentLikeHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}/likes',
    handler: (request, h) => handler.putReplyLikeHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
