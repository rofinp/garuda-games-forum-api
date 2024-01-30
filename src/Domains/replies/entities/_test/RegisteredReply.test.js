const RegisteredReply = require('../RegisteredReply');

describe('a RegisteredReply entity', () => {
  it('should throw an error when the payload does not contain the required property', () => {
    // Arrange
    const payload = {
      content: 'This is a reply',
    };

    // Action & Assert
    expect(() => new RegisteredReply(payload)).toThrow('REGISTERED_REPLY.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specifications', () => {
    // Arrange
    const payload = {
      id: true,
      content: {},
      owner: ['user-123'],
    };

    // Action & Assert
    expect(() => new RegisteredReply(payload)).toThrow('REGISTERED_REPLY.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a RegisteredReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'This is a reply',
      owner: 'user-123',
    };

    // Action
    const registeredReply = new RegisteredReply(payload);

    // Assert
    expect(registeredReply).toHaveProperty('id', payload.id);
    expect(registeredReply).toHaveProperty('content', payload.content);
    expect(registeredReply).toHaveProperty('owner', payload.owner);
  });
});
