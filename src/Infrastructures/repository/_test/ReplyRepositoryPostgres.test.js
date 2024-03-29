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
      fullname: 'Rofi Nugraha',
    });

    await ThreadsTableTestHelper.addThread({});

    await CommentsTableTestHelper.addComment({});
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
        content: 'This is your mommy reply',
      });

      const commentId = 'comment-123';
      const owner = 'user-123';

      const fakeIdGenerator = () => '123'; // stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredReply = await replyRepositoryPostgres
        .addReply(owner, commentId, registerReply);

      // Assert
      const getReply = await RepliesTableTestHelper.findReplyById(registeredReply.id);
      expect(getReply).toBeDefined();
      expect(getReply).toHaveProperty('id', 'reply-123');
      expect(getReply).toHaveProperty('comment_id', commentId);
      expect(getReply).toHaveProperty('owner', owner);
      expect(registeredReply).toStrictEqual(new RegisteredReply({
        id: 'reply-123',
        content: 'This is your mommy reply',
        owner,
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

      // Assert
      const getReply = await RepliesTableTestHelper.findReplyById(reply.id);
      expect(getReply).toBeDefined();
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
      expect(commentReplies).toHaveLength(0);
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
        comment_id: 'comment-123',
        content: 'This is your mom reply',
        created_at: '2021-08-08T07:19:09.775Z',
        is_deleted: false,
      };

      const secondReply = {
        id: 'reply-321',
        comment_id: 'comment-123',
        content: 'This is your dad reply',
        created_at: '2021-08-08T07:19:09.775Z',
        is_deleted: false,
      };

      await RepliesTableTestHelper.addReply({ ...firstReply, owner: 'user-123' });
      await RepliesTableTestHelper.addReply({ ...secondReply, owner: 'user-321' });

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

  describe('verifyReplyExistance function', () => {
    it('should throw a NotFoundError when the reply does not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyExistance({
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
      await expect(replyRepositoryPostgres.verifyReplyExistance({
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

      // Action & Assert
      const deletedReply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(deletedReply).toBeDefined();
      expect(deletedReply).toHaveProperty('is_deleted', true);
      expect(deletedReply).toHaveProperty('content', '**balasan telah dihapus**');
      await expect(replyRepositoryPostgres.verifyReplyExistance({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
      })).rejects.toThrow(NotFoundError);
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
      })).rejects.toThrow(AuthorizationError);
    });

    it('should not throw an AuthorizationError when the user is authorized', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAuthorization({
        owner: 'user-123',
        replyId: 'reply-123',
      })).resolves.not.toThrow(AuthorizationError);
    });
  });
});
