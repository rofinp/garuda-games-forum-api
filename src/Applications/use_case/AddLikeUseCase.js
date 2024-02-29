class AddLikeUseCase {
  constructor({ likeRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
  }

  async execute(owner, requestParams) {
    const { threadId, commentId } = requestParams;
    await this._commentRepository.verifyCommentExistance({ threadId, commentId });
    const isCommentLiked = await this._likeRepository.isCommentLiked({ owner, commentId });

    if (isCommentLiked) {
      await this._likeRepository.deleteLikeByOwnerAndCommentId({ owner, commentId });
    } else {
      await this._likeRepository.addLike(owner, commentId);
    }
  }
}

module.exports = AddLikeUseCase;
