const RegisterThread = require('../../Domains/threads/entities/RegisterThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    const { title, body } = useCasePayload;
    const registerThread = new RegisterThread({ title, body });
    const addedThread = await this._threadRepository.addThread(owner, registerThread);
    return addedThread;
  }
}

module.exports = AddThreadUseCase;
