class RegisterReply {
  constructor(payload) {
    this._verifyThePayload(payload);

    const { content } = payload;

    this.content = content;
  }

  _verifyThePayload({ content }) {
    if (!content) {
      throw new Error('REGISTER_REPLY.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('REGISTER_REPLY.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisterReply;
