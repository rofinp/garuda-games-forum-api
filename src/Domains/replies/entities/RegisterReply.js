class RegisterReply {
  constructor(payload) {
    this._verifyThePayload(payload);

    const { commentId, content, owner } = payload;

    this.commentId = commentId;
    this.content = content;
    this.owner = owner;
  }

  _verifyThePayload({ commentId, content, owner }) {
    if (!commentId || !content || !owner) {
      throw new Error('REGISTER_REPLY.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('REGISTER_REPLY.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisterReply;
