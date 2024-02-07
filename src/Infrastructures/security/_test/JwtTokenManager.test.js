const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const JwtTokenManager = require('../JwtTokenManager');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');

describe('JwtTokenManager', () => {
  it('should instance of AuthenticationTokenManager', () => {
    const jwtTokenManager = new JwtTokenManager(Jwt.token);
    expect(jwtTokenManager).toBeInstanceOf(AuthenticationTokenManager);
  });

  describe('the generateAccessToken function', () => {
    it('should generate an accessToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'rofinugraha',
      };

      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };

      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const accessToken = await jwtTokenManager.generateAccessToken(payload);

      // Assert
      expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('the generateRefreshToken function', () => {
    it('should generate a refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'rofinugraha',
      };

      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };

      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const refreshToken = await jwtTokenManager.generateRefreshToken(payload);

      // Assert
      expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw an InvariantError on failed refresh token verification', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.generateAccessToken({ username: 'rofinugraha' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
        .rejects
        .toThrow(InvariantError);
    });

    it('should not throw an InvariantError for a verified refresh token', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.generateRefreshToken({ username: 'rofinugraha' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError);
    });
  });

  describe('verifyAccessToken function', () => {
    it('should throw an InvariantError on failed access token verification', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.generateRefreshToken({ username: 'rofinugraha' });

      // Action & Assert
      await expect(jwtTokenManager.verifyAccessToken(refreshToken))
        .rejects
        .toThrow(InvariantError);
    });

    it('should not throw an InvariantError for a verified access token', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.generateAccessToken({ username: 'rofinugraha' });

      // Action & Assert
      await expect(jwtTokenManager.verifyAccessToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError);
    });
  });

  describe('the decodePayload function', () => {
    it('should decode the payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.generateAccessToken({ username: 'rofinugraha' });

      // Action
      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken);

      // Action & Assert
      expect(expectedUsername).toEqual('rofinugraha');
    });
  });
});
