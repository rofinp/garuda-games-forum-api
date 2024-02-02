const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of the ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});
    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist and return the registered thread object correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'rofinugraha',
        password: 'supersecret',
        fullname: 'Rofi Nugraha',
      });

      const registerThread = new RegisterThread({
        title: 'untitled thread',
        body: 'hello world',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredThread = await threadRepositoryPostgres.addThread(registerThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById(registeredThread.id);
      expect(thread).toHaveLength(1);
      expect(registeredThread).toStrictEqual(new RegisteredThread({
        id: 'thread-123',
        title: 'untitled thread',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw a NotFoundError when the thread is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should return thread details when the thread is found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'rofinugraha',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'untitled thread',
        body: 'hello world',
        date: '2021-08-08T07:19:09.775Z',
        owner: 'user-123',
      });

      // Action
      const getThread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(getThread).toStrictEqual({
        id: 'thread-123',
        title: 'untitled thread',
        body: 'hello world',
        date: '2021-08-08T07:19:09.775Z',
        username: 'rofinugraha',
      });
    });
  });

  // describe('getRepliesByThreadId function', () => {
  //   it('should return replies in a thread comments', async () => {
  //     // Arrange
  //     const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

  //     await UsersTableTestHelper.addUser({
  //       id: 'user-123',
  //       username: 'rofinugraha',
  //       password: 'supersecret',
  //       fullname: 'Rofi Nugraha',
  //     });

  //     await UsersTableTestHelper.addUser({
  //       id: 'user-313',
  //       username: 'ashleygraham',
  //       password: 'supersecret',
  //       fullname: 'Ashley Graham',
  //     });

  //     await ThreadsTableTestHelper.addThread({
  //       id: 'thread-123',
  //       title: 'untitled thread',
  //       body: 'hello world',
  //       date: '2021-08-08T07:19:09.775Z',
  //       owner: 'user-123',
  //     });

  //     await CommentsTableTestHelper.addComment({
  //       id: 'comment-123',
  //       threadId: 'thread-123',
  //       content: 'I love you so much Almonds',
  //       owner: 'user-123',
  //       date: '2021-08-08T07:19:09.775Z',
  //       isDeleted: false,
  //     });

  //     await CommentsTableTestHelper.addComment({
  //       id: 'comment-313',
  //       threadId: 'thread-123',
  //       content: 'I love you so much Hazelnuts',
  //       owner: 'user-313',
  //       date: '2021-09-08T07:19:09.775Z',
  //       isDeleted: false,
  //     });

  //     const reply1 = {
  //       id: 'reply-123',
  //       commentId: 'comment-123',
  //       content: 'This is your mom reply',
  //       date: '2021-08-08T07:30:09.775Z',
  //       isDeleted: false,
  //     };

  //     const reply2 = {
  //       id: 'reply-313',
  //       commentId: 'comment-313',
  //       content: 'This is your dad reply',
  //       date: '2021-10-08T07:30:09.775Z',
  //       isDeleted: false,
  //     };

  //     await RepliesTableTestHelper.addReply({ ...reply1, owner: 'user-313' });
  //     await RepliesTableTestHelper.addReply({ ...reply2, owner: 'user-123' });

  //     // Action
  //     const getThreadReplies = await threadRepositoryPostgres.getRepliesByThreadId('thread-123');

  //     // Assert
  //     expect(getThreadReplies).toEqual([
  //       { ...reply1, username: 'ashleygraham' },
  //       { ...reply2, username: 'rofinugraha' },
  //     ]);
  //   });
  // });
});
