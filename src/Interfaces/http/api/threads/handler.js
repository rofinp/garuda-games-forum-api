const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, request.headers);
    const response = h.response({
      status: 'success',
      data: { addedThread },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const getThreadUseCase = await this._container.getInstance(GetThreadUseCase.name);
    const detailThread = await getThreadUseCase.execute(request.params);
    const response = h.response({
      status: 'success',
      data: {
        thread: detailThread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
