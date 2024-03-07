const ReplyLikeRepositoryPostgres = require('../ReplyLikeRepositoryPostgres');
const ReplyLikeRepository = require('../../../Domains/likes/ReplyLikeRepository');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ReplyLikesTableTestHelper = require('../../../../tests/ReplyLikesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');

describe('ReplyLikeRepositoryPostgres', () => {
  it('should be instance of ReplyLikeRepository domain', async () => {
    // Arrange
    const replyLikeRepositoryPostgres = new ReplyLikeRepositoryPostgres({}, {});

    // Action & Assert
    expect(replyLikeRepositoryPostgres).toBeInstanceOf(ReplyLikeRepository);
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'rofinugraha',
      fullname: 'Rofi Nugraha',
    });

    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
    await RepliesTableTestHelper.addReply({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await ReplyLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReplyLike function', () => {
    it('should add a like to the database', async () => {
      // Arrange
      const replyId = 'reply-123';
      const owner = 'user-123';
      const fakeIdGenerator = () => '123';
      const replyLikeRepositoryPostgres = new ReplyLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredLike = await replyLikeRepositoryPostgres.addReplyLike(owner, replyId);

      // Assert
      const getReplyLikes = await ReplyLikesTableTestHelper
        .findReplyLikeById(registeredLike.id);

      expect(registeredLike).toStrictEqual({
        id: 'like-123',
      });
      expect(getReplyLikes).toHaveProperty('id', 'like-123');
      expect(getReplyLikes).toHaveProperty('reply_id', replyId);
      expect(getReplyLikes).toHaveProperty('owner', owner);
      expect(getReplyLikes).toHaveProperty('liked_at');
    });
  });

  describe('deleteLikeByOwnerAndReplyId function', () => {
    it('should throw a NotFoundError when the like does not exist or is not found', async () => {
      // Arrange
      const replyLikeRepositoryPostgres = new ReplyLikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyLikeRepositoryPostgres.deleteLikeByOwnerAndReplyId({
        owner: 'user-123',
        threadId: 'thread-123',
      }))
        .rejects.toThrow(NotFoundError);
    });

    it('should delete the like if it exists or is found', async () => {
      // Arrange
      const replyLikeRepositoryPostgres = new ReplyLikeRepositoryPostgres(pool, {});
      const like = {
        id: 'like-123',
        replyId: 'reply-123',
        owner: 'user-123',
      };

      await ReplyLikesTableTestHelper.addReplyLike(like);

      // Action
      await replyLikeRepositoryPostgres.deleteLikeByOwnerAndReplyId({
        owner: like.owner,
        replyId: like.replyId,
      });

      // Assert
      const getReplyLikes = await ReplyLikesTableTestHelper.findReplyLikeById(like.id);
      expect(getReplyLikes).toBeUndefined();
    });
  });

  describe('getLikeCountsByReplyId function', () => {
    it('should return a number of 0 when the like do not exist for the reply', async () => {
      // Arrange
      const replyLikeRepositoryPostgres = new ReplyLikeRepositoryPostgres(pool, {});

      // Action
      const likeCounts = await replyLikeRepositoryPostgres.getLikeCountsByReplyId('reply-123');

      // Assert
      expect(likeCounts.length).toStrictEqual(0);
    });

    it('should return & count all likes for the reply', async () => {
      // Arrange
      const replyLikeRepositoryPostgres = new ReplyLikeRepositoryPostgres(pool, {});

      /* add second user to the database */
      await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'ashleygraham',
        fullname: 'Ashley Graham',
      });

      /* adds some likes to the thread */
      const firstLike = {
        id: 'like-123',
        reply_id: 'reply-123',
        owner: 'user-123',
      };

      const secondLike = {
        id: 'like-321',
        reply_id: 'reply-123',
        owner: 'user-321',
      };

      await ReplyLikesTableTestHelper.addReplyLike(firstLike);
      await ReplyLikesTableTestHelper.addReplyLike(secondLike);

      // Action
      const likeCounts = await replyLikeRepositoryPostgres.getLikeCountsByReplyId('reply-123');

      // Assert
      expect(likeCounts.length).toStrictEqual(2);
    });
  });

  describe('isReplyLiked function', () => {
    it('should return false if the reply has not liked', async () => {
      // Arrange
      const replyLikeRepositoryPostgres = new ReplyLikeRepositoryPostgres(pool, {});

      // Action
      const isReplyLiked = await replyLikeRepositoryPostgres
        .isReplyLiked({ owner: 'user-123', replyId: 'reply-123' });

      // Assert
      expect(isReplyLiked).toEqual(false);
    });

    it('should return true if the reply has been liked', async () => {
      // Arrange
      const replyLikeRepositoryPostgres = new ReplyLikeRepositoryPostgres(pool, {});
      await ReplyLikesTableTestHelper.addReplyLike({});

      // Action
      const isReplyLiked = await replyLikeRepositoryPostgres
        .isReplyLiked({ owner: 'user-123', replyId: 'reply-123' });

      // Assert
      expect(isReplyLiked).toEqual(true);
    });
  });
});
