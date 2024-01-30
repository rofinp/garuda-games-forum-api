const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const RegisterReply = require('../../../Domains/replies/entities/RegisterReply');
const RegisteredReply = require('../../../Domains/replies/entities/RegisteredReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of ReplyRepository domain', async () => {
    // Arrange
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {});

    // Action & Assert
    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepository);
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'rofinugraha',
    });

    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      owner: 'user-123',
    });

    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      owner: 'user-123',
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist and return the registered reply object correctly', async () => {
      // Arrange
      const registerReply = new RegisterReply({
        commentId: 'comment-123',
        content: 'This is your mommy reply',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredReply = await replyRepositoryPostgres.addReply(registerReply);
      const getReply = await RepliesTableTestHelper.findReplyById(registeredReply.id);

      // Assert
      expect(getReply).toHaveProperty('id', 'reply-123');
      expect(registeredReply).toStrictEqual(new RegisteredReply({
        id: 'reply-123',
        content: 'This is your mommy reply',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteReply function', () => {
    it('should throw a NotFoundError when the reply does not exist or is not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReply('reply-123'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should soft delete the reply if it exists or is found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const reply = {
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'This is your mom reply',
        owner: 'user-123',
      };

      await RepliesTableTestHelper.addReply(reply);

      // Action
      await replyRepositoryPostgres.deleteReply(reply.id);
      const getReply = await RepliesTableTestHelper.findReplyById(reply.id);

      // Assert
      expect(getReply).toHaveProperty('content', '**balasan telah dihapus**');
      expect(getReply).toHaveProperty('is_deleted', true);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return an empty array when the replies do not exist for the comment', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const commentReplies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      // Assert
      expect(commentReplies).toStrictEqual([]);
    });

    it('should return all replies from the comment', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'ashleygraham',
      });

      const firstReply = {
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'This is your mom reply',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
        isDeleted: false,
      };

      const secondReply = {
        id: 'reply-321',
        commentId: 'comment-123',
        content: 'This is your dad reply',
        owner: 'user-321',
        date: '2021-08-08T07:19:09.775Z',
        isDeleted: false,
      };

      await RepliesTableTestHelper.addReply(firstReply);
      await RepliesTableTestHelper.addReply(secondReply);

      // Action
      const allCommentReplies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      // Assert
      expect(allCommentReplies).toHaveLength(2);
      expect(allCommentReplies).toStrictEqual([
        { ...firstReply, username: 'rofinugraha' },
        { ...secondReply, username: 'ashleygraham' },
      ]);
    });
  });

  describe('getReplyByIds function', () => {
    it('should throw a NotFoundError when the reply does not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.getReplyByIds({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
      }))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not throw a NotFoundError when the reply exists', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({});

      await RepliesTableTestHelper.findReplyById('reply-123');

      // Action & Assert
      await expect(replyRepositoryPostgres.getReplyByIds({
        threadId: 'thread-123', commentId: 'comment-123', replyId: 'reply-123',
      }))
        .resolves
        .not.toThrow(NotFoundError);
    });

    it('should throw a NotFoundError when the reply is already deleted', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: '**balasan telah dihapus**',
        isDeleted: true,
      });

      const deletedReply = await RepliesTableTestHelper.findReplyById('reply-123');

      // Action & Assert
      expect(deletedReply).toHaveProperty('is_deleted', true);
      expect(deletedReply).toHaveProperty('content', '**balasan telah dihapus**');
      await expect(replyRepositoryPostgres.getReplyByIds({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
      }))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('verifyReplyAuthorization function', () => {
    it('should throw an AuthotizationError when the user is unauthorized', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAuthorization({
        owner: '' || undefined || 'user-313',
        replyId: 'reply-123',
      }))
        .rejects
        .toThrow(AuthorizationError);
    });

    it('should not throw an AuthorizationError when the user is authorized', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAuthorization({
        owner: 'user-123',
        replyId: 'reply-123',
      }))
        .resolves
        .not.toThrow(AuthorizationError);
    });
  });
});
