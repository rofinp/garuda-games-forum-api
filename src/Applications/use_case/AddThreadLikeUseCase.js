class AddThreadLikeUseCase {
  constructor({ threadLikeRepository, threadRepository }) {
    this._threadLikeRepository = threadLikeRepository;
    this._threadRepository = threadRepository;
  }

  async execute(owner, threadId) {
    await this._threadRepository.verifyThreadExistance(threadId);
    const isThreadLiked = await this._threadLikeRepository.isThreadLiked({ owner, threadId });

    if (isThreadLiked) {
      await this._threadLikeRepository.deleteLikeByOwnerAndThreadId({ owner, threadId });
    } else {
      await this._threadLikeRepository.addThreadLike(owner, threadId);
    }
  }
}

module.exports = AddThreadLikeUseCase;
