class AddReplyLikeUseCase {
  constructor({ replyLikeRepository, replyRepository }) {
    this._replyLikeRepository = replyLikeRepository;
    this._replyRepository = replyRepository;
  }

  async execute(owner, commentId, threadId, replyId) {
    await this._replyRepository.verifyReplyExistance({ threadId, commentId, replyId });
    const isReplyLiked = await this._replyLikeRepository.isReplyLiked({ owner, replyId });

    if (isReplyLiked) {
      await this._replyLikeRepository.deleteLikeByOwnerAndReplyId({ owner, replyId });
    } else {
      await this._replyLikeRepository.addReplyLike(owner, replyId);
    }
  }
}

module.exports = AddReplyLikeUseCase;
