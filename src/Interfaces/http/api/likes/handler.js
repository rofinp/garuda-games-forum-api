const AddCommentLikeUseCase = require('../../../../Applications/use_case/AddCommentLikeUseCase');

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
}

module.exports = LikesHandler;
