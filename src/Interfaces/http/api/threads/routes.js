const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    options: {
      handler: (request, h) => handler.postThreadHandler(request, h),
      auth: 'forumapi_jwt',
      plugins: {
        'hapi-swagger': {
          description: 'Create a new thread',
          notes: 'This API endpoint is used to create a new thread.',
          tags: ['api', 'threads'],
          validate: {
            payload: Joi.object({
              title: Joi.string().required().description('The title of the thread'),
              body: Joi.string().required().description('The body of the thread'),
            }).label('PostThreadsPayload'),
          },
          response: {
            schema: Joi.object({
              status: Joi.string().valid('success').required(),
              data: Joi.object({
                id: Joi.string().required().description('The unique identifier of the thread'),
                title: Joi.string().required().description('The title of the thread'),
                owner: Joi.string().required().description('The owner of the thread'),
              }),
            }).label('PostThreadsResponse'),
          },
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    options: {
      handler: (request, h) => handler.getThreadHandler(request, h),
      plugins: {
        'hapi-swagger': {
          description: 'Show the details of a thread',
          notes: 'This API endpoint is used to show the details of a thread.',
          tags: ['api', 'threads'],
          response: {
            schema: Joi.object({
              status: Joi.string().valid('success').required(),
              data: Joi.object({
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
            }).label('GetThreadResponse'),
          },
        },
      },
    },
  },
]);

module.exports = routes;
