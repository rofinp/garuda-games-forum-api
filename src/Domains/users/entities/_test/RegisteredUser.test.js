const RegisteredUser = require('../RegisteredUser');

describe('a RegisteredUser entities', () => {
  it('should throw an error when the payload does not contain the required property', () => {
    // Arrange
    const payload = {
      username: 'rofinugraha',
      fullname: 'Rofi Nugraha',
    };

    // Action & Assert
    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specifications', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'rofinugraha',
      fullname: {},
    };

    // Action & Assert
    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a registeredUser object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'rofinugraha',
      fullname: 'Rofi Nugraha',
    };

    // Action
    const registeredUser = new RegisteredUser(payload);

    // Assert
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.username).toEqual(payload.username);
    expect(registeredUser.fullname).toEqual(payload.fullname);
  });
});
