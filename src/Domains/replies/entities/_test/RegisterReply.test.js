const RegisterReply = require('../RegisterReply');

describe('a RegisterReply entities', () => {
  it('should throw an error when the payload does not contain the required property', () => {
    // Arrange
    const payload = {
      content: 'This is a reply',
    };

    // Action & Assert
    expect(() => new RegisterReply(payload)).toThrow('REGISTER_REPLY.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specifications', () => {
    // Arrange
    const payload = {
      commentId: ['comment-123'],
      content: {},
      owner: 123,
    };

    // Action & Assert
    expect(() => new RegisterReply(payload)).toThrow('REGISTER_REPLY.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a RegisterReply object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'This is a reply',
      owner: 'user-123',
    };

    // Action
    const { commentId, content, owner } = new RegisterReply(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
