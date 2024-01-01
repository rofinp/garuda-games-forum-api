const RegisterUser = require('../RegisterUser');

describe('a RegisterUser entities', () => {
  it('should throw an error when the payload does not contain the required property', () => {
    // Arrange
    const payload = {
      username: 'abc',
      password: 'abc',
    };

    // Action & Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specifications', () => {
    // Arrange
    const payload = {
      username: 123,
      fullname: true,
      password: 'abc',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw an error when the username exeeds 50 characters', () => {
    // Arrange
    const payload = {
      username: 'rofinugraharofinugraharofinugraharofinugraharofinugraharofinugraha',
      fullname: 'Rofi Nugraha',
      password: 'abc',
    };

    // Action & Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.USERNAME_LIMIT_CHAR');
  });

  it('should throw an error when the username contains a restricted character', () => {
    // Arrange
    const payload = {
      username: 'rofi nugraha',
      fullname: 'Rofi Nugraha',
      password: 'abc',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });

  it('should create a registerUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'rofinugraha',
      fullname: 'Rofi Nugraha',
      password: 'abc',
    };

    // Action
    const { username, fullname, password } = new RegisterUser(payload);

    // Assert
    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
    expect(password).toEqual(payload.password);
  });
});
