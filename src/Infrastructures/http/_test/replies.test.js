const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should respond with a 201 status code and the persisted reply', async () => {
      // Arrange
      const server = await createServer(container);

      /* add a user to the database */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'rofinugraha',
          password: 'supersecret',
          fullname: 'Rofi Nugraha',
        },
      });

      /* add an authentication (login) & get the user's access token */
      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'rofinugraha',
          password: 'supersecret',
        },
      });

      const { accessToken } = (JSON.parse(responseAuthentication.payload)).data;

      /* add a thread & get the thread's id */
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'The Almonds',
          body: 'I love you so much Almonds',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { id: threadId } = (JSON.parse(responseThread.payload)).data.addedThread;

      /* add a comment & get the comment's id */
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'What a comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { id: commentId } = (JSON.parse(responseComment.payload)).data.addedComment;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'This is your mom reply',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 201);
      expect(responseJson).toHaveProperty('status', 'success');
      expect(responseJson.data).toHaveProperty('addedReply');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should respond with a 200 status code if the reply is successfully deleted', async () => {
      // Arrange
      const server = await createServer(container);

      /* add a user to the database */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'rofinugraha',
          password: 'supersecret',
          fullname: 'Rofi Nugraha',
        },
      });

      /* add an authentication (login) & get the user's access token */
      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'rofinugraha',
          password: 'supersecret',
        },
      });

      const { accessToken } = (JSON.parse(responseAuthentication.payload)).data;

      /* add a thread & get the thread's id */
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'The Almonds',
          body: 'I love you so much Almonds',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { id: threadId } = (JSON.parse(responseThread.payload)).data.addedThread;

      /* add a comment & get the comment's id */
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'What a comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { id: commentId } = (JSON.parse(responseComment.payload)).data.addedComment;

      /* add a reply & get the reply's id */
      const responseReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'This is your mom reply',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { id: replyId } = (JSON.parse(responseReply.payload)).data.addedReply;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 200);
      expect(responseJson).toHaveProperty('status', 'success');
    });
  });
});
