class RegisterThread {
  constructor(payload) {
    this._verifyThePayload(payload);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
  }

  _verifyThePayload({ title, body }) {
    if (!title || !body) {
      throw new Error('REGISTER_THREAD.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('REGISTER_THREAD.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (title.length > 150) {
      throw new Error('REGISTER_THREAD.TITLE_LIMIT_CHAR');
    }
  }
}

module.exports = RegisterThread;
