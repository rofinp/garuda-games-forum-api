const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;
  }

  async postReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase
      .execute(owner, request.params, request.payload);
    return h.response({
      status: 'success',
      data: { addedReply },
    }).code(201);
  }

  async deleteReplyHandler(request) {
    const { id: owner } = request.auth.credentials;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute(owner, request.params);

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
