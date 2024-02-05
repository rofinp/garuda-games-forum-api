const RegisterReply = require('../RegisterReply');

describe('a RegisterReply entities', () => {
  it('should throw an error when the payload does not contain the required property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new RegisterReply(payload)).toThrow('REGISTER_REPLY.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specifications', () => {
    // Arrange
    const payload = {
      content: {},
    };

    // Action & Assert
    expect(() => new RegisterReply(payload)).toThrow('REGISTER_REPLY.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a RegisterReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'This is a reply',
    };

    // Action
    const { content } = new RegisterReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
