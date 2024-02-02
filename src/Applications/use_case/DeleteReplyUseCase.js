class DeleteReplyUseCase {
  constructor({ replyRepository, authenticationTokenManager }) {
    this._replyRepository = replyRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseParams, useCaseHeaders) {
    const { authorization } = useCaseHeaders;
    const accessToken = await this._authenticationTokenManager
      .getAuthorizationToken(authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    const { replyId } = useCaseParams;
    await this._replyRepository.verifyReplyExistance(useCaseParams);
    await this._replyRepository.verifyReplyAuthorization({ owner, replyId });
    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
