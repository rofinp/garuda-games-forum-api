const RegisterThread = require('../../Domains/threads/entities/RegisterThread');

class AddThreadUseCase {
  constructor({ threadRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseHeaders) {
    const { authorization } = useCaseHeaders;
    const accessToken = await this._authenticationTokenManager
      .getAuthorizationToken(authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    const registerThread = new RegisterThread({ ...useCasePayload, owner });
    return this._threadRepository.addThread(registerThread);
  }
}

module.exports = AddThreadUseCase;
