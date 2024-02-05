const RegisterComment = require('../RegisterComment');

describe('a RegisterComment entities', () => {
  it('should throw an error when the payload does not contain the required property', () => {
    // Arrange
    const payload = {
    };

    // Action & Assert
    expect(() => new RegisterComment(payload)).toThrow('REGISTER_COMMENT.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specifications', () => {
    // Arrange
    const payload = {
      content: {},
    };

    // Action & Assert
    expect(() => new RegisterComment(payload)).toThrow('REGISTER_COMMENT.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a RegisterComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'what a comment',
    };

    // Action
    const { content } = new RegisterComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
