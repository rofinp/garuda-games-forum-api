const EncryptionHelper = require('../PasswordHash');

describe('EncryptionHelper interface', () => {
  it('should throw an error when invoking abstract behavior', async () => {
    // Arrange
    const encryptionHelper = new EncryptionHelper();

    // Action & Assert
    await expect(encryptionHelper.hash('dummy_password')).rejects.toThrow('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
    await expect(encryptionHelper.comparePassword('plain', 'encrypted')).rejects.toThrow('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  });
});
