class DeleteCommentUseCase {
  constructor({ commentRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseParams, useCaseHeaders) {
    const { authorization } = useCaseHeaders;
    const accessToken = await this._authenticationTokenManager
      .getAuthorizationToken(authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    const { commentId } = useCaseParams;
    await this._commentRepository.verifyCommentExistance(useCaseParams);
    await this._commentRepository.verifyCommentAuthorization({ owner, commentId });
    await this._commentRepository.deleteCommentByCommentId(commentId);
  }
}

module.exports = DeleteCommentUseCase;
