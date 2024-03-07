const ThreadLikeRepositoryPostgres = require('../ThreadLikeRepositoryPostgres');
const ThreadLikeRepository = require('../../../Domains/likes/ThreadLikeRepository');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadLikesTableTestHelper = require('../../../../tests/ThreadLikesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');

describe('ThreadLikeRepositoryPostgres', () => {
  it('should be instance of ThreadLikeRepository domain', async () => {
    // Arrange
    const threadLikeRepositoryPostgres = new ThreadLikeRepositoryPostgres({}, {});

    // Action & Assert
    expect(threadLikeRepositoryPostgres).toBeInstanceOf(ThreadLikeRepository);
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
    await ThreadLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThreadLike function', () => {
    it('should add a like to the database', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';
      const fakeIdGenerator = () => '123';
      const threadLikeRepositoryPostgres = new ThreadLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredLike = await threadLikeRepositoryPostgres.addThreadLike(owner, threadId);

      // Assert
      const getThreadLikes = await ThreadLikesTableTestHelper
        .findThreadLikeById(registeredLike.id);

      expect(registeredLike).toStrictEqual({
        id: 'like-123',
      });
      expect(getThreadLikes).toHaveProperty('id', 'like-123');
      expect(getThreadLikes).toHaveProperty('thread_id', threadId);
      expect(getThreadLikes).toHaveProperty('owner', owner);
      expect(getThreadLikes).toHaveProperty('liked_at');
    });
  });

  describe('deleteLikeByOwnerAndThreadId function', () => {
    it('should throw a NotFoundError when the like does not exist or is not found', async () => {
      // Arrange
      const threadLikeRepositoryPostgres = new ThreadLikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadLikeRepositoryPostgres.deleteLikeByOwnerAndThreadId({
        owner: 'user-123',
        threadId: 'thread-123',
      }))
        .rejects.toThrow(NotFoundError);
    });

    it('should delete the like if it exists or is found', async () => {
      // Arrange
      const threadLikeRepositoryPostgres = new ThreadLikeRepositoryPostgres(pool, {});
      const like = {
        id: 'like-123',
        threadId: 'thread-123',
        owner: 'user-123',
      };

      await ThreadLikesTableTestHelper.addThreadLike(like);

      // Action
      await threadLikeRepositoryPostgres.deleteLikeByOwnerAndThreadId({
        owner: like.owner,
        threadId: like.threadId,
      });

      // Assert
      const getThreadLike = await ThreadLikesTableTestHelper.findThreadLikeById(like.id);
      expect(getThreadLike).toBeUndefined();
    });
  });

  describe('getLikeCountsByThreadId function', () => {
    it('should return a number of 0 when the like do not exist for the thread', async () => {
      // Arrange
      const threadLikeRepositoryPostgres = new ThreadLikeRepositoryPostgres(pool, {});

      // Action
      const likeCounts = await threadLikeRepositoryPostgres.getLikeCountsByThreadId('thread-123');

      // Assert
      expect(likeCounts.length).toStrictEqual(0);
    });

    it('should return & count all likes for the thread', async () => {
      // Arrange
      const threadLikeRepositoryPostgres = new ThreadLikeRepositoryPostgres(pool, {});

      /* add second user to the database */
      await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'ashleygraham',
        fullname: 'Ashley Graham',
      });

      /* adds some likes to the thread */
      const firstLike = {
        id: 'like-123',
        thread_id: 'thread-123',
        owner: 'user-123',
      };

      const secondLike = {
        id: 'like-321',
        thread_id: 'thread-123',
        owner: 'user-321',
      };

      await ThreadLikesTableTestHelper.addThreadLike(firstLike);
      await ThreadLikesTableTestHelper.addThreadLike(secondLike);

      // Action
      const likeCounts = await threadLikeRepositoryPostgres.getLikeCountsByThreadId('thread-123');

      // Assert
      expect(likeCounts.length).toStrictEqual(2);
    });
  });

  describe('isThreadLiked function', () => {
    it('should return false if the thread has not liked', async () => {
      // Arrange
      const threadLikeRepositoryPostgres = new ThreadLikeRepositoryPostgres(pool, {});

      // Action
      const isThreadLiked = await threadLikeRepositoryPostgres
        .isThreadLiked({ owner: 'user-123', threadId: 'thread-123' });

      // Assert
      expect(isThreadLiked).toEqual(false);
    });

    it('should return true if the thread has been liked', async () => {
      // Arrange
      const threadLikeRepositoryPostgres = new ThreadLikeRepositoryPostgres(pool, {});
      await ThreadLikesTableTestHelper.addThreadLike({});

      // Action
      const isThreadLiked = await threadLikeRepositoryPostgres
        .isThreadLiked({ owner: 'user-123', threadId: 'thread-123' });

      // Assert
      expect(isThreadLiked).toEqual(true);
    });
  });
});
