const AddCommentLikeUseCase = require('../../../../Applications/use_case/AddCommentLikeUseCase');
const AddThreadLikeUseCase = require('../../../../Applications/use_case/AddThreadLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
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

  async putThreadLikeHandler(request, h) {
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addThreadLikeUseCase = this._container.getInstance(AddThreadLikeUseCase.name);
    await addThreadLikeUseCase.execute(owner, threadId);
    return h.response({
      status: 'success',
    }).code(200);
  }
}

module.exports = LikesHandler;
