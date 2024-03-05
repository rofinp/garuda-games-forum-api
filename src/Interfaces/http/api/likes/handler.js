const AddCommentLikeUseCase = require('../../../../Applications/use_case/AddCommentLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
  }

  async putLikeHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addCommentLikeUseCase = this._container.getInstance(AddCommentLikeUseCase.name);
    await addCommentLikeUseCase.execute(owner, request.params);
    return h.response({
      status: 'success',
    }).code(200);
  }
}

module.exports = LikesHandler;
