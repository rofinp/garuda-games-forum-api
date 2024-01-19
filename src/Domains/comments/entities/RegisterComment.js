class RegisterComment {
  constructor(payload) {
    this._verifyThePayload(payload);

    const {
      threadId, content, owner,
    } = payload;

    this.threadId = threadId;
    this.content = content;
    this.owner = owner;
  }

  _verifyThePayload({
    threadId, content, owner,
  }) {
    if (!threadId || !content || !owner) {
      throw new Error('REGISTER_COMMENT.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('REGISTER_COMMENT.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisterComment;
