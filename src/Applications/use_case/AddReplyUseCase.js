const RegisterReply = require('../../Domains/replies/entities/RegisterReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(owner, threadId, commentId, requestPayload) {
    await this._commentRepository.verifyCommentExistance({ threadId, commentId });
    const registerReply = new RegisterReply({
      ...requestPayload,
    });
    const addedReply = await this._replyRepository.addReply(owner, commentId, registerReply);
    return addedReply;
  }
}

module.exports = AddReplyUseCase;
