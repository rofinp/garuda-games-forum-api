const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const BcryptEncryptionHelper = require('../BcryptPasswordHash');

describe('BcryptEncryptionHelper', () => {
  describe('the hash function', () => {
    it('should encrypt the password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt);

      // Action
      const encryptedPassword = await bcryptEncryptionHelper.hash('plain_password');

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10); // 10 is the default value for BcryptEncryptionHelper's saltRound
    });
  });

  describe('the comparePassword function', () => {
    it('should throw an AuthenticationError if the password does not match', async () => {
      // Arrange
      const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt);

      // Action & Assert
      await expect(bcryptEncryptionHelper.comparePassword('plain_password', 'encrypted_password'))
        .rejects
        .toThrow(AuthenticationError);
    });

    it('should not return an AuthenticationError for a matching password', async () => {
      // Arrange
      const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt);
      const plainPassword = 'secret';
      const encryptedPassword = await bcryptEncryptionHelper.hash(plainPassword);

      // Action & Assert
      await expect(bcryptEncryptionHelper.comparePassword(plainPassword, encryptedPassword))
        .resolves.not.toThrow(AuthenticationError);
    });
  });
});
