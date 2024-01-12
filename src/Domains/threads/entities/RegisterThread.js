class RegisterThread {
  constructor(payload) {
    this._verifyThePayload(payload);

    const { title, body, owner } = payload;

    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyThePayload({ title, body, owner }) {
    if (!title || !body || !owner) {
      throw new Error('REGISTER_THREAD.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('REGISTER_THREAD.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (title.length > 150) {
      throw new Error('REGISTER_THREAD.TITLE_LIMIT_CHAR');
    }
  }
}

module.exports = RegisterThread;
