const AddLikeUseCase = require('../../../../Applications/use_case/AddLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
  }

  async putLikeHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addLikeUseCase = this._container.getInstance(AddLikeUseCase.name);
    await addLikeUseCase.execute(owner, request.params);
    return h.response({
      status: 'success',
    }).code(200);
  }
}

module.exports = LikesHandler;
