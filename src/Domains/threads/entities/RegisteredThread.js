class RegisteredThread {
  constructor(payload) {
    this._verifyThePayload(payload);
    const { id, title, owner } = payload;
    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _verifyThePayload({ id, title, owner }) {
    if (!id || !title || !owner) {
      throw new Error('REGISTERED_THREAD.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('REGISTERED_THREAD.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredThread;
