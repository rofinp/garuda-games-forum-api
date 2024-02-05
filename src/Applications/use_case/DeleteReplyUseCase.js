class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(owner, useCaseParams) {
    const { threadId, commentId, replyId } = useCaseParams;
    await this._replyRepository.verifyReplyExistance({ threadId, commentId, replyId });
    await this._replyRepository.verifyReplyAuthorization({ owner, replyId });
    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
