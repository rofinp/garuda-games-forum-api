const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require(('../../../../tests/UsersTableTestHelper'));
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
      await expect(threadRepositoryPostgres.getThreadById('thread-313'))
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
});
