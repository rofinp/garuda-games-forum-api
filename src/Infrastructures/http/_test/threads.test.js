const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
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
    await RepliesTableTestHelper.cleanTable();
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

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'johndoe',
          password: 'supersecret',
          fullname: 'John Doe',
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
        accessToken:
        rofiAccessToken,
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
        accessToken:
        ashleyAccessToken,
      } = (JSON.parse(responseAuthenticationAshley.payload)).data;

      const responseAuthenticationJohn = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'johndoe',
          password: 'supersecret',
        },
      });

      const {
        accessToken:
        johnAccessToken,
      } = (JSON.parse(responseAuthenticationJohn.payload)).data;

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

      /* add some likes to the thread */
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/likes`,
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/likes`,
        headers: {
          Authorization: `Bearer ${johnAccessToken}`,
        },
      });

      /* add a comment to the thread */
      const responseComment1 = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'What a comment',
        },
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      const { id: commentId1 } = (JSON.parse(responseComment1.payload)).data.addedComment;

      const responseComment2 = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'What a comment, buddy',
        },
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
        },
      });

      const { id: commentId2 } = (JSON.parse(responseComment2.payload)).data.addedComment;

      /* delete a comment from the database */
      await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId2}`,
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
        },
      });

      /* add some like to a comment */
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId1}/likes`,
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
        },
      });

      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId1}/likes`,
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId1}/likes`,
        headers: {
          Authorization: `Bearer ${johnAccessToken}`,
        },
      });

      /* unlike the comment for user ashley */
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId1}/likes`,
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      /* add some replies */
      const responseReply1 = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId1}/replies`,
        payload: {
          commentId: commentId1,
          content: 'This is your mom reply',
        },
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
        },
      });

      const { id: replyId1 } = (JSON.parse(responseReply1.payload)).data.addedReply;

      const responseReply2 = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId1}/replies`,
        payload: {
          commentId: commentId1,
          content: 'This is your dad reply',
        },
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      const { id: replyId2 } = (JSON.parse(responseReply2.payload)).data.addedReply;

      /* delete a reply */
      await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId1}/replies/${replyId2}`,
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      /* add some likes to reply1 */
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId1}/replies/${replyId1}/likes`,
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId1}/replies/${replyId1}/likes`,
        headers: {
          Authorization: `Bearer ${johnAccessToken}`,
        },
      });

      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId1}/replies/${replyId1}/likes`,
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
        },
      });

      /* unlike a reply for user rofi */
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId1}/replies/${replyId1}/likes`,
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 200);
      expect(responseJson).toHaveProperty('status', 'success');
    }, 20000);
  });
});
