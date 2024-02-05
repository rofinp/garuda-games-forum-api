const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment');
const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of the CommentRepository domain', () => {
    // Arrange
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

    // Action & Assert
    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
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
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist and return the registered comment object correctly', async () => {
      // Arrange
      const registerComment = new RegisterComment({
        content: 'What a comment',
      });

      const owner = 'user-123';
      const threadId = 'thread-123';

      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredComment = await commentRepositoryPostgres
        .addComment(owner, threadId, registerComment);

      const getComment = await CommentsTableTestHelper.findCommentById(registeredComment.id);

      // Assert
      expect(getComment).toBeDefined();
      expect(getComment).toHaveProperty('id', 'comment-123');
      expect(getComment).toHaveProperty('thread_id', threadId);
      expect(getComment).toHaveProperty('owner', owner);
      expect(registeredComment).toStrictEqual(new RegisteredComment({
        id: 'comment-123',
        content: 'What a comment',
        owner,
      }));
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return an empty array when the comments do not exist for the thread', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const threadComments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(threadComments).toStrictEqual([]);
      expect(threadComments).toHaveLength(0);
    });

    it('should return all comments from the thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'ashleygraham',
      });

      const firstComment = {
        id: 'comment-123',
        thread_id: 'thread-123',
        content: 'What a comment 1',
        date: '2021-08-08T07:19:09.775Z',
        is_deleted: false,
      };

      const secondComment = {
        id: 'comment-321',
        thread_id: 'thread-123',
        content: 'What a comment 2',
        date: '2021-09-09T07:19:09.775Z',
        is_deleted: false,
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({ ...firstComment, owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ ...secondComment, owner: 'user-321' });

      // Action
      const allThreadComments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(allThreadComments).toHaveLength(2);
      expect(allThreadComments).toStrictEqual([
        { ...firstComment, username: 'rofinugraha' },
        { ...secondComment, username: 'ashleygraham' },
      ]);
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw a NotFoundError when the comment does not exist or is not found', async () => {
      // Aarrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentByCommentId('comment-123'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should soft delete the comment if it exists or is found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comment = {
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'What a comment',
        owner: 'user-123',
      };

      await CommentsTableTestHelper.addComment(comment);

      // Action
      await commentRepositoryPostgres.deleteCommentByCommentId(comment.id);

      // Assert
      const getComment = await CommentsTableTestHelper.findCommentById(comment.id);
      expect(getComment).toBeDefined();
      expect(getComment).toHaveProperty('is_deleted', true);
    });
  });

  describe('verifyCommentExistance function', () => {
    it('should throw a NotFoundError when the comment does not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExistance({ threadId: 'thread-123', commentId: 'comment-123' }))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not throw a NotFoundError when the comment exists', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({});
      const getComment = await CommentsTableTestHelper.findCommentById('comment-123');

      // Action & Assert
      expect(getComment).toBeDefined();
      await expect(commentRepositoryPostgres.verifyCommentExistance({ threadId: 'thread-123', commentId: 'comment-123' }))
        .resolves
        .not.toThrow(NotFoundError);
    });

    it('should throw a NotFoundError when the comment is already deleted', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: '**komentar telah dihapus**',
        isDeleted: true,
      });

      const deletedComment = await CommentsTableTestHelper.findCommentById('comment-123');

      // Action & Assert
      expect(deletedComment).toHaveProperty('is_deleted', true);
      expect(deletedComment).toHaveProperty('content', '**komentar telah dihapus**');
      await expect(commentRepositoryPostgres.verifyCommentExistance({ threadId: 'thread-123', commentId: 'comment-123' }))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('verifyCommentAuthorization function', () => {
    it('should throw an AuthorizationError when the user is unauthorized', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAuthorization({
        owner: '' || undefined || 'user-313',
        commentId: 'comment-123',
      }))
        .rejects
        .toThrow(AuthorizationError);
    });

    it('should not throw an AuthorizationError when the user is authorized', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAuthorization({
        owner: 'user-123',
        commentId: 'comment-123',
      }))
        .resolves
        .not.toThrow(AuthorizationError);
    });
  });
});
