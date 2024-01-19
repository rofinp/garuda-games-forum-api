const RegisterComment = require('../RegisterComment');

describe('a RegisterComment entities', () => {
  it('should throw an error when the payload does not contain the required property', () => {
    // Arrange
    const payload = {
      username: 'rofinugraha',
    };

    // Action & Assert
    expect(() => new RegisterComment(payload)).toThrow('REGISTER_COMMENT.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specifications', () => {
    // Arrange
    const payload = {
      threadId: ['thread-123'],
      content: {},
      owner: 123,
    };

    // Action & Assert
    expect(() => new RegisterComment(payload)).toThrow('REGISTER_COMMENT.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a RegisterComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'what a comment',
      owner: 'user-123',
    };

    // Action
    const {
      threadId, content, owner,
    } = new RegisterComment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
