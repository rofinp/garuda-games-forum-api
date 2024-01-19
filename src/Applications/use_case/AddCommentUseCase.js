const RegisterComment = require('../../Domains/comments/entities/RegisterComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(requestPayload, requestParams, requestHeaders) {
    const { threadId } = requestParams;
    const { authorization } = requestHeaders;
    const accessToken = await this._authenticationTokenManager
      .getAuthorizationToken(authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    await this._threadRepository.getThreadById(threadId);
    const registerComment = new RegisterComment({
      threadId,
      ...requestPayload,
      owner,
    });
    return this._commentRepository.addComment(registerComment);
  }
}

module.exports = AddCommentUseCase;
