const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should respond with a 201 status code and the persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'The Almonds',
        body: 'I love you so much Almonds',
      };

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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 201);
      expect(responseJson).toHaveProperty('status', 'success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should respond with a 400 status code when the thread payload does not contain required property', async () => {
      // Arrange
      const requestPayload = {
        body: 'I love you so much Almonds',
      };

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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should respond with a 400 status code when the thread payload does not meet data type specifications', async () => {
      // Arrange
      const requestPayload = {
        title: ['The Almonds'],
        body: true,
      };

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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 400);
      expect(responseJson).toHaveProperty('status', 'fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('should respond with a 400 status code when the thread title exceeds 150 characters', async () => {
      // Arrange
      const requestPayload = {
        title: 'The Almonds The Almonds The Almonds The Almonds The Almonds The Almonds The Almonds The Almonds The Almonds The Almonds The Almonds The Almonds The Almonds',
        body: 'I love you so much Almonds',
      };

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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena karakter title melebihi batas limit');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should respond with a 200 status code and the detail thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'The Almonds',
        body: 'I love you so much Almonds',
      };

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
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { id: threadId } = (JSON.parse(responseThread.payload)).data.addedThread;

      /* add a comment to the thread */
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'What a comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'What a comment, buddy',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { id: commentId } = (JSON.parse(responseComment.payload)).data.addedComment;

      /* delete a comment from the database */
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
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
