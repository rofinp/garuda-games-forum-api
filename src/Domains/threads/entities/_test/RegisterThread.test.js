const RegisterThread = require('../RegisterThread');

describe('a NewThread entities', () => {
  it('should throw an error when the payload does not contain the required property', () => {
    // Arrange
    const payload = {
      title: 'untitled',
    };

    // Action & Assert
    expect(() => new RegisterThread(payload)).toThrow('REGISTER_THREAD.DOES_NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specifications', () => {
    // Arrange
    const payload = {
      title: 123,
      body: 'hello world',
    };

    // Action & Assert
    expect(() => new RegisterThread(payload)).toThrow('REGISTER_THREAD.DOES_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw an error when the title exeeds 150 characters', () => {
    // Arrange
    const payload = {
      title: 'hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world title',
      body: 'hello world',
    };

    // Action & Assert
    expect(() => new RegisterThread(payload)).toThrow('REGISTER_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create a registerThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Hello world',
      body: 'Description',
    };

    // Action
    const { title, body } = new RegisterThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
