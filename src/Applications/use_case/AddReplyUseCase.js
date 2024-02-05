const RegisterReply = require('../../Domains/replies/entities/RegisterReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(owner, requestParams, requestPayload) {
    const { commentId } = requestParams;
    await this._commentRepository.verifyCommentExistance({ ...requestParams });
    const registerReply = new RegisterReply({
      ...requestPayload,
    });
    return this._replyRepository.addReply(owner, commentId, registerReply);
  }
}

module.exports = AddReplyUseCase;
