const RegisterComment = require('../../Domains/comments/entities/RegisterComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(owner, threadId, requestPayload) {
    await this._threadRepository.verifyThreadExistance(threadId);
    const registerComment = new RegisterComment({
      ...requestPayload,
    });
    const addedComment = await this._commentRepository.addComment(owner, threadId, registerComment);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;
