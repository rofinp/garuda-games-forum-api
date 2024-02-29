const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');

describe('LikeRepositoryPostgres', () => {
  it('should be instance of LikeRepository domain', async () => {
    // Arrange
    const likeRepositoryPostgres = new LikeRepositoryPostgres({}, {});

    // Action & Assert
    expect(likeRepositoryPostgres).toBeInstanceOf(LikeRepository);
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
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should add a like to the database', async () => {
      // Arrange
      const commentId = 'comment-123';
      const owner = 'user-123';
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredLike = await likeRepositoryPostgres.addLike(owner, commentId);

      // Assert
      const getLike = await LikesTableTestHelper.findLikeById(registeredLike.id);

      expect(registeredLike).toStrictEqual({
        id: 'like-123',
      });
      expect(getLike).toStrictEqual({
        id: 'like-123',
        comment_id: commentId,
        owner,
      });
    });
  });

  describe('deleteLikeByCommentIdAndOwner function', () => {
    it('should throw a NotFoundError when the like does not exist or is not found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(likeRepositoryPostgres.deleteLikeByLikeId('like-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should delete the like if it exists or is found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const like = {
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      };

      await LikesTableTestHelper.addLike(like);

      // Action
      await likeRepositoryPostgres.deleteLikeByLikeId(like.id);

      // Assert
      const getLike = await LikesTableTestHelper.findLikeById(like.id);
      expect(getLike).toBeUndefined();
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should return a number of 0 when the like do not exist for the comment', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likeCount = await likeRepositoryPostgres.getLikeCountByCommentId('comment-123');

      // Assert
      expect(likeCount.length).toStrictEqual(0);
    });

    it('should return & count all likes for the comment', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

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

      await LikesTableTestHelper.addLike(firstLike);
      await LikesTableTestHelper.addLike(secondLike);

      // Action
      const countLikes = await likeRepositoryPostgres.getLikeCountByCommentId('comment-123');

      // Assert
      expect(countLikes.length).toStrictEqual(2);
    });
  });

  describe('verifyLikeAuthorization function', () => {
    it('should throw an AuthorizationError when the user is unauthorized', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikesTableTestHelper.addLike({});

      // Action & Assert
      await expect(likeRepositoryPostgres.verifyLikeAuthorization({
        owner: '' || undefined || 'user-313',
        likeId: 'like-123',
      }))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw an AuthorizationError when the user is authorized', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikesTableTestHelper.addLike({});

      // Action & Assert
      await expect(likeRepositoryPostgres.verifyLikeAuthorization({
        owner: 'user-123',
        likeId: 'like-123',
      }))
        .resolves.not.toThrow(AuthorizationError);
    });
  });
});
