const AddCommentLikeUseCase = require('../../../../Applications/use_case/AddCommentLikeUseCase');
const AddThreadLikeUseCase = require('../../../../Applications/use_case/AddThreadLikeUseCase');
const AddReplyLikeUseCase = require('../../../../Applications/use_case/AddReplyLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
  }

  async putThreadLikeHandler(request, h) {
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addThreadLikeUseCase = this._container.getInstance(AddThreadLikeUseCase.name);
    await addThreadLikeUseCase.execute(owner, threadId);
    return h.response({
      status: 'success',
    }).code(200);
  }

  async putCommentLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addCommentLikeUseCase = this._container.getInstance(AddCommentLikeUseCase.name);
    await addCommentLikeUseCase.execute(owner, commentId, threadId);
    return h.response({
      status: 'success',
    }).code(200);
  }

  async putReplyLikeHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addReplyLikeUseCase = this._container.getInstance(AddReplyLikeUseCase.name);
    await addReplyLikeUseCase.execute(owner, commentId, threadId, replyId);
    return h.response({
      status: 'success',
    }).code(200);
  }
}

module.exports = LikesHandler;
