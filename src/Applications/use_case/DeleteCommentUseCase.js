class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(owner, useCaseParams) {
    const { threadId, commentId } = useCaseParams;
    await this._commentRepository.verifyCommentExistance({ threadId, commentId });
    await this._commentRepository.verifyCommentAuthorization({ owner, commentId });
    await this._commentRepository.deleteCommentByCommentId(commentId);
  }
}

module.exports = DeleteCommentUseCase;
