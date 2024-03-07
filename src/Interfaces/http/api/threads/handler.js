const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, owner);
    return h.response({
      status: 'success',
      data: { addedThread },
    }).code(201);
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;
    const getThreadUseCase = await this._container.getInstance(GetThreadUseCase.name);
    const detailThread = await getThreadUseCase.execute(threadId);
    return h.response({
      status: 'success',
      data: {
        thread: detailThread,
      },
    }).code(200);
  }
}

module.exports = ThreadsHandler;
