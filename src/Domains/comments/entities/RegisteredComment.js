class RegisteredComment {
  constructor(payload) {
    this._verifyThePayload(payload);

    const { id, content, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyThePayload({ id, content, owner }) {
    if (!id || !content || !owner) {
      throw new Error('REGISTERED_COMMENT.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('REGISTERED_COMMENT.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredComment;
