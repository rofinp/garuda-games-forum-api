const RegisterReply = require('../../Domains/replies/entities/RegisterReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, authenticationTokenManager }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(requestPayload, requestParams, requestHeaders) {
    const { authorization } = requestHeaders;
    const { threadId, commentId } = requestParams;
    const accessToken = await this._authenticationTokenManager
      .getAuthorizationToken(authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    await this._commentRepository.verifyCommentExistance({ threadId, commentId });
    const registerReply = new RegisterReply({
      commentId,
      ...requestPayload,
      owner,
    });
    return this._replyRepository.addReply(registerReply);
  }
}

module.exports = AddReplyUseCase;
