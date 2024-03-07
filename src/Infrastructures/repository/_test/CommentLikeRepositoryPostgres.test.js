const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
const CommentLikeRepository = require('../../../Domains/likes/CommentLikeRepository');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');

describe('CommentLikeRepositoryPostgres', () => {
  it('should be instance of CommentLikeRepository domain', async () => {
    // Arrange
    const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres({}, {});

    // Action & Assert
    expect(commentLikeRepositoryPostgres).toBeInstanceOf(CommentLikeRepository);
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
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCommentLike function', () => {
    it('should add a like to the database', async () => {
      // Arrange
      const commentId = 'comment-123';
      const owner = 'user-123';
      const fakeIdGenerator = () => '123';
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const registeredLike = await commentLikeRepositoryPostgres.addCommentLike(owner, commentId);

      // Assert
      const getCommentLikes = await CommentLikesTableTestHelper
        .findCommentLikeById(registeredLike.id);

      expect(registeredLike).toStrictEqual({
        id: 'like-123',
      });
      expect(getCommentLikes).toHaveProperty('id', 'like-123');
      expect(getCommentLikes).toHaveProperty('comment_id', commentId);
      expect(getCommentLikes).toHaveProperty('owner', owner);
      expect(getCommentLikes).toHaveProperty('liked_at');
    });
  });

  describe('deleteLikeByOwnerAndCommentId function', () => {
    it('should throw a NotFoundError when the like does not exist or is not found', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentLikeRepositoryPostgres.deleteLikeByOwnerAndCommentId({
        owner: 'user-123',
        commentId: 'comment-123',
      }))
        .rejects.toThrow(NotFoundError);
    });

    it('should delete the like if it exists or is found', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
      const like = {
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      };

      await CommentLikesTableTestHelper.addCommentLike(like);

      // Action
      await commentLikeRepositoryPostgres.deleteLikeByOwnerAndCommentId({
        owner: like.owner,
        commentId: like.commentId,
      });

      // Assert
      const getCommentLike = await CommentLikesTableTestHelper.findCommentLikeById(like.id);
      expect(getCommentLike).toBeUndefined();
    });
  });

  describe('getLikeCountsByCommentId function', () => {
    it('should return a number of 0 when the like do not exist for the comment', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const likeCounts = await commentLikeRepositoryPostgres.getLikeCountsByCommentId('comment-123');

      // Assert
      expect(likeCounts.length).toStrictEqual(0);
    });

    it('should return & count all likes for the comment', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      /* add second user to the database */
      await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'ashleygraham',
        fullname: 'Ashley Graham',
      });

      /* adds some likes to the comment */
      const firstLike = {
        id: 'like-123',
        comment_id: 'comment-123',
        owner: 'user-123',
      };

      const secondLike = {
        id: 'like-321',
        comment_id: 'comment-123',
        owner: 'user-321',
      };

      await CommentLikesTableTestHelper.addCommentLike(firstLike);
      await CommentLikesTableTestHelper.addCommentLike(secondLike);

      // Action
      const likeCounts = await commentLikeRepositoryPostgres.getLikeCountsByCommentId('comment-123');

      // Assert
      expect(likeCounts.length).toStrictEqual(2);
    });
  });

  describe('isCommentLiked function', () => {
    it('should return false if the comment has not liked', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const isCommentLiked = await commentLikeRepositoryPostgres
        .isCommentLiked({ owner: 'user-123', commentId: 'comment-123' });

      // Assert
      expect(isCommentLiked).toEqual(false);
    });

    it('should return true if the comment has been liked', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
      await CommentLikesTableTestHelper.addCommentLike({});

      // Action
      const isCommentLiked = await commentLikeRepositoryPostgres
        .isCommentLiked({ owner: 'user-123', commentId: 'comment-123' });

      // Assert
      expect(isCommentLiked).toEqual(true);
    });
  });
});
