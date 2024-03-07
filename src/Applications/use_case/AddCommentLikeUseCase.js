class AddCommentLikeUseCase {
  constructor({ commentLikeRepository, commentRepository }) {
    this._commentLikeRepository = commentLikeRepository;
    this._commentRepository = commentRepository;
  }

  async execute(owner, commentId, threadId) {
    await this._commentRepository.verifyCommentExistance({ threadId, commentId });
    const isCommentLiked = await this._commentLikeRepository.isCommentLiked({ owner, commentId });

    if (isCommentLiked) {
      await this._commentLikeRepository.deleteLikeByOwnerAndCommentId({ owner, commentId });
    } else {
      await this._commentLikeRepository.addCommentLike(owner, commentId);
    }
  }
}

module.exports = AddCommentLikeUseCase;
