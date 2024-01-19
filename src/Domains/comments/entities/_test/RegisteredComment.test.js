const RegisteredComment = require('../RegisteredComment');

describe('a RegisteredComment entities', () => {
  it('should throw an error when the payload does not contain the required property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'what a comment',
    };

    // Action & Assert
    expect(() => new RegisteredComment(payload)).toThrow('REGISTERED_COMMENT.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specifications', () => {
    // Arrange
    const payload = {
      id: ['comment-123'],
      content: {},
      owner: 123,
    };

    // Action & Assert
    expect(() => new RegisteredComment(payload)).toThrow('REGISTERED_COMMENT.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a RegisteredComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'what a comment',
      owner: 'user-123',
    };

    // Action
    const registeredComment = new RegisteredComment(payload);

    // Assert
    expect(registeredComment.id).toEqual(payload.id);
    expect(registeredComment.content).toEqual(payload.content);
    expect(registeredComment.owner).toEqual(payload.owner);
  });
});
