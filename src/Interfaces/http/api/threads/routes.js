const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    options: {
      handler: (request, h) => handler.postThreadHandler(request, h),
      auth: 'forumapi_jwt',
      description: 'Create a new thread',
      notes: 'This API endpoint is used to create a new thread.',
      tags: ['api', 'threads'],
      validate: {
        payload: Joi.object({
          title: Joi.string().max(150).required().description('The title of the thread'),
          body: Joi.string().required().description('The body of the thread'),
        }).label('PostThreadPayload'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
          data: Joi.object({
            addedThread: Joi.object({
              id: Joi.string().max(50).required().description('The unique identifier of the thread'),
              title: Joi.string().max(150).required().description('The title of the thread'),
              owner: Joi.string().max(50).required().description('The owner id of the thread'),
            }),
          }),
        }).label('PostThreadResponse'),
      },
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    options: {
      handler: (request, h) => handler.getThreadHandler(request, h),
      description: 'Show the details of a thread',
      notes: 'This API endpoint is used to show the details of a thread.',
      tags: ['api', 'threads'],
      validate: {
        params: Joi.object({
          threadId: Joi.string().required(),
        }).label('GetThreadParams'),
      },
      response: {
        schema: Joi.object({
          status: Joi.string().valid('success').required(),
          data: Joi.object({
            thread: Joi.object({
              id: Joi.string().required().description('The unique identifier of the thread'),
              title: Joi.string().required().description('The title of the thread'),
              body: Joi.string().required().description('The body of the thread'),
              created_at: Joi.string().required().description('The date of the thread created'),
              updated_at: Joi.string().required().description('The date of the thread updated'),
              username: Joi.string().required().description('The username of the thread owner'),
              likeCounts: Joi.number().required().description('The number of the thread like counts'),
              comments: Joi.array().items(Joi.object({
                id: Joi.string().required().description('The unique identifier of the comment'),
                username: Joi.string().required().description('The username of the comment owner'),
                date: Joi.string().required().description('The date of the comment created'),
                replies: Joi.array().items(Joi.object({
                  id: Joi.string().required().description('The unique identifier of the reply'),
                  content: Joi.string().required().description('The content of the reply'),
                  date: Joi.string().required().description('The date of the reply created'),
                  username: Joi.string().required().description('The username of the reply owner'),
                  likeCounts: Joi.number().required().description('The number of the reply like counts'),
                })),
                content: Joi.string().required().description('The content of the comment'),
                likeCounts: Joi.number().required().description('The number of the comment like counts'),
              })),
            }),
          }),
        }).label('GetThreadsResponse'),
      },
    },
  },
]);

module.exports = routes;
