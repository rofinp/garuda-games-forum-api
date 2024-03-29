const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
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

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'rofinugraha',
      password: 'supersecret',
      fullname: 'Rofi Nugraha',
    });
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
      const registerThread = new RegisterThread({
        title: 'untitled thread',
        body: 'hello world',
      });

      const owner = 'user-123';

      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredThread = await threadRepositoryPostgres.addThread(owner, registerThread);

      // Assert
      const getThread = await ThreadsTableTestHelper.findThreadById(registeredThread.id);
      expect(getThread).toBeDefined();
      expect(getThread).toHaveProperty('owner', 'user-123');
      expect(registeredThread).toStrictEqual(new RegisteredThread({
        id: 'thread-123',
        title: 'untitled thread',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should return the thread details correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'untitled thread',
        body: 'hello world',
        owner: 'user-123',
        created_at: '2021-08-08T07:19:09.775Z',
        updated_at: '2021-08-08T07:19:09.775Z',
      });

      // Action
      const getThread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(getThread).toStrictEqual({
        id: 'thread-123',
        title: 'untitled thread',
        body: 'hello world',
        username: 'rofinugraha',
        created_at: '2021-08-08T07:19:09.775Z',
        updated_at: '2021-08-08T07:19:09.775Z',
      });
    });
  });

  describe('verifyThreadExistance function', () => {
    it('should throw a NotFoundError when the thread does not exist or is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExistance('thread-123'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not throw a NotFoundError when the thread exists or is found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({});
      const getThread = await ThreadsTableTestHelper.findThreadById('thread-123');

      // Action & Assert
      expect(getThread).toBeDefined();
      await expect(threadRepositoryPostgres.verifyThreadExistance('thread-123'))
        .resolves
        .not.toThrow(NotFoundError);
    });
  });
});
