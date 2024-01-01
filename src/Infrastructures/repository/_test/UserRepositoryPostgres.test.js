const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('confirmUsernameAvailability function', () => {
    it('should throw an InvariantError when the username is unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'rofinugraha' }); // memasukan user baru dengan username dicoding
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.confirmUsernameAvailability('rofinugraha')).rejects.toThrow(InvariantError);
    });

    it('should not throw an InvariantError when the username is available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.confirmUsernameAvailability('rofinugraha')).resolves.not.toThrow(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist and return the registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'rofinugraha',
        password: 'secret_password',
        fullname: 'Rofi Nugraha',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return the registered user object correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'rofinugraha',
        password: 'secret_password',
        fullname: 'Rofi Nugraha',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'rofinugraha',
        fullname: 'Rofi Nugraha',
      }));
    });
  });

  describe('getPasswordByUsername function', () => {
    it('should throw an InvariantError when the username is not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(userRepositoryPostgres.getPasswordByUsername('rofinugraha'))
        .rejects
        .toThrow(InvariantError);
    });

    it('should return the user password when the username is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        username: 'rofinugraha',
        password: 'secret_password',
      });

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername('rofinugraha');
      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername function', () => {
    it('should throw an InvariantError when the username is not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('rofinugraha'))
        .rejects
        .toThrow(InvariantError);
    });

    it('should return the user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'rofinugraha' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('rofinugraha');

      // Assert
      expect(userId).toEqual('user-321');
    });
  });
});
