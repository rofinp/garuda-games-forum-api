const RegisteredThread = require('../RegisteredThread');

describe('a RegisteredThread entity', () => {
  it('should throw an error when the payload does not contain the required property', () => {
    // Arrange
    const payload = {
      title: 'untitled',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new RegisteredThread(payload)).toThrow('REGISTERED_THREAD.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specifications', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'untitled',
      owner: {},
    };

    // Action & Assert
    expect(() => new RegisteredThread(payload)).toThrow('REGISTERED_THREAD.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a registeredThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'untitled',
      owner: 'user-123',
    };

    // Action
    const registeredThread = new RegisteredThread(payload);

    // Assert
    expect(registeredThread.id).toEqual(payload.id);
    expect(registeredThread.title).toEqual(payload.title);
    expect(registeredThread.owner).toEqual(payload.owner);
  });
});
