const UserLogin = require('../UserLogin');

describe('a UserLogin entities', () => {
  it('should throw an error when the payload does not contain the required property', () => {
    // Arrange
    const payload = {
      username: 'rofinugraha',
    };

    // Action & Assert
    expect(() => new UserLogin(payload)).toThrow('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specifications', () => {
    // Arrange
    const payload = {
      username: 'rofinugraha',
      password: 12345,
    };

    // Action & Assert
    expect(() => new UserLogin(payload)).toThrow('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a UserLogin object correctly', () => {
    // Arrange
    const payload = {
      username: 'rofinugraha',
      password: '12345',
    };

    // Action
    const userLogin = new UserLogin(payload);

    // Assert
    expect(userLogin).toBeInstanceOf(UserLogin);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});
