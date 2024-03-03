const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should respond with a 201 status code and the persisted comment', async () => {
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'What a comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson).toHaveProperty('status', 'success');
      expect(responseJson.data).toHaveProperty('addedComment');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should respond with a 400 status code when the comment payload does not contain the required property', async () => {
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

      const requestPayload = {};

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
    });

    it('should respond with a 400 status code when the comment payload does not meet the data type specifications', async () => {
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

      const requestPayload = {
        content: [],
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should respond with a 200 status code if the comment is successfully deleted', async () => {
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

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'ashleygraham',
          password: 'supersecret',
          fullname: 'Ashley Graham',
        },
      });

      /* add an authentication (login) & get the user's access token */
      const responseAuthenticationRofi = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'rofinugraha',
          password: 'supersecret',
        },
      });

      const {
        accessToken: rofiAccessToken,
      } = (JSON.parse(responseAuthenticationRofi.payload)).data;

      const responseAuthenticationAshley = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ashleygraham',
          password: 'supersecret',
        },
      });

      const {
        accessToken: ashleyAccessToken,
      } = (JSON.parse(responseAuthenticationAshley.payload)).data;

      /* add a thread & get the thread's id */
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'The Almonds',
          body: 'I love you so much Almonds',
        },
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
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
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      const { id: commentId } = (JSON.parse(responseComment.payload)).data.addedComment;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson).toHaveProperty('status', 'success');
    });

    it('should respond with a 403 status code if someone other than the owner tries to delete the comment', async () => {
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

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'ashleygraham',
          password: 'supersecret',
          fullname: 'Ashley Graham',
        },
      });

      /* add an authentication (login) & get the user's access token */
      const responseAuthenticationRofi = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'rofinugraha',
          password: 'supersecret',
        },
      });

      const {
        accessToken: rofiAccessToken,
      } = (JSON.parse(responseAuthenticationRofi.payload)).data;

      const responseAuthenticationAshley = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ashleygraham',
          password: 'supersecret',
        },
      });

      const {
        accessToken: ashleyAccessToken,
      } = (JSON.parse(responseAuthenticationAshley.payload)).data;

      /* add a thread & get the thread's id */
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'The Almonds',
          body: 'I love you so much Almonds',
        },
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
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
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      const { id: commentId } = (JSON.parse(responseComment.payload)).data.addedComment;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 403);
      expect(responseJson).toHaveProperty('status', 'fail');
    });
  });
});
