class AddLikeUseCase {
  constructor({ likeRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
  }

  async execute(owner, requestParams) {
    const { threadId, commentId } = requestParams;
    await this._commentRepository.verifyCommentExistance({ threadId, commentId });
    await this._likeRepository.addLike(owner, commentId);
  }
}

module.exports = AddLikeUseCase;
