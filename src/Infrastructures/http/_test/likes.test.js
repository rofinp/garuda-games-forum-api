const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const ThreadLikesTableTestHelper = require('../../../../tests/ThreadLikesTableTestHelper');
const ReplyLikesTableTestHelper = require('../../../../tests/ReplyLikesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('When .../likes enpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
    await ThreadLikesTableTestHelper.cleanTable();
    await ReplyLikesTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/likes', () => {
    it('should respond with a 200 status code if the user liked the thread', async () => {
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

      /* add two authentications (login) & get the user's access token */
      const rofiResponseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'rofinugraha',
          password: 'supersecret',
        },
      });

      const {
        accessToken: rofiAccessToken,
      } = (JSON.parse(rofiResponseAuthentication.payload)).data;

      const ashleyResponseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ashleygraham',
          password: 'supersecret',
        },
      });

      const {
        accessToken: ashleyAccessToken,
      } = (JSON.parse(ashleyResponseAuthentication.payload)).data;

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

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/likes`,
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 200);
      expect(responseJson).toHaveProperty('status', 'success');
    }, 50000);

    it('should respond with a 200 status code if the user unliked the thread', async () => {
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

      /* add two authentications (login) & get the user's access token */
      const rofiResponseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'rofinugraha',
          password: 'supersecret',
        },
      });

      const {
        accessToken: rofiAccessToken,
      } = (JSON.parse(rofiResponseAuthentication.payload)).data;

      const ashleyResponseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ashleygraham',
          password: 'supersecret',
        },
      });

      const {
        accessToken: ashleyAccessToken,
      } = (JSON.parse(ashleyResponseAuthentication.payload)).data;

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

      /* add or giving a like to the thread */
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/likes`,
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/likes`,
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 200);
      expect(responseJson).toHaveProperty('status', 'success');
    });
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should respond with a 200 status code if the user liked the comment', async () => {
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

      /* add two authentications (login) & get the user's access token */
      const rofiResponseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'rofinugraha',
          password: 'supersecret',
        },
      });

      const {
        accessToken: rofiAccessToken,
      } = (JSON.parse(rofiResponseAuthentication.payload)).data;

      const ashleyResponseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ashleygraham',
          password: 'supersecret',
        },
      });

      const {
        accessToken: ashleyAccessToken,
      } = (JSON.parse(ashleyResponseAuthentication.payload)).data;

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
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 200);
      expect(responseJson).toHaveProperty('status', 'success');
    }, 50000);

    it('should respond with a 200 status code if the user unliked the comment', async () => {
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

      /* add two authentications (login) & get the user's access token */
      const rofiResponseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'rofinugraha',
          password: 'supersecret',
        },
      });

      const {
        accessToken: rofiAccessToken,
      } = (JSON.parse(rofiResponseAuthentication.payload)).data;

      const ashleyResponseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ashleygraham',
          password: 'supersecret',
        },
      });

      const {
        accessToken: ashleyAccessToken,
      } = (JSON.parse(ashleyResponseAuthentication.payload)).data;

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

      /* add or giving a like to the comment */
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 200);
      expect(responseJson).toHaveProperty('status', 'success');
    });
  });
  // ----------------------------------------------------------------
  describe('when PUT /threads/{threadId}/comments/{commentId}/replies/{replyId}/likes', () => {
    it('should respond with a 200 status code if the user liked the reply', async () => {
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

      /* add two authentications (login) & get the user's access token */
      const rofiResponseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'rofinugraha',
          password: 'supersecret',
        },
      });

      const {
        accessToken: rofiAccessToken,
      } = (JSON.parse(rofiResponseAuthentication.payload)).data;

      const ashleyResponseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ashleygraham',
          password: 'supersecret',
        },
      });

      const {
        accessToken: ashleyAccessToken,
      } = (JSON.parse(ashleyResponseAuthentication.payload)).data;

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

      /* add a reply & get the reply's id */
      const responseReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'Your mum reply',
        },
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
        },
      });

      const { id: replyId } = (JSON.parse(responseReply.payload)).data.addedReply;

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}/likes`,
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 200);
      expect(responseJson).toHaveProperty('status', 'success');
    }, 50000);

    it('should respond with a 200 status code if the user unliked the reply', async () => {
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

      /* add two authentications (login) & get the user's access token */
      const rofiResponseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'rofinugraha',
          password: 'supersecret',
        },
      });

      const {
        accessToken: rofiAccessToken,
      } = (JSON.parse(rofiResponseAuthentication.payload)).data;

      const ashleyResponseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'ashleygraham',
          password: 'supersecret',
        },
      });

      const {
        accessToken: ashleyAccessToken,
      } = (JSON.parse(ashleyResponseAuthentication.payload)).data;

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

      /* add a reply & get the reply's id */
      const responseReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'Your mum reply',
        },
        headers: {
          Authorization: `Bearer ${rofiAccessToken}`,
        },
      });

      const { id: replyId } = (JSON.parse(responseReply.payload)).data.addedReply;

      /* add or giving a like to the reply */
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}/likes`,
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}/likes`,
        headers: {
          Authorization: `Bearer ${ashleyAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response).toHaveProperty('statusCode', 200);
      expect(responseJson).toHaveProperty('status', 'success');
    });
  });
});
