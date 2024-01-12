const RegisterThread = require('../RegisterThread');

describe('a NewThread entities', () => {
  it('should throw an error when the payload does not contain the required property', () => {
    // Arrange
    const payload = {
      title: 'untitled',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new RegisterThread(payload)).toThrow('REGISTER_THREAD.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specifications', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      owner: {},
    };

    // Action & Assert
    expect(() => new RegisterThread(payload)).toThrow('REGISTER_THREAD.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw an error when the title exeeds 150 characters', () => {
    // Arrange
    const payload = {
      title: 'hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world title',
      body: 'hello world',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new RegisterThread(payload)).toThrow('REGISTER_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create a registerThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'untitled',
      body: 'hello world',
      owner: 'user-123',
    };

    // Action
    const { title, body, owner } = new RegisterThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
