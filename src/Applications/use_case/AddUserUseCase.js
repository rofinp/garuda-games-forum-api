const RegisterUser = require('../../Domains/users/entities/RegisterUser');

class AddUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.confirmUsernameAvailability(registerUser.username);
    registerUser.password = await this._passwordHash.hash(registerUser.password);
    const addedUser = await this._userRepository.addUser(registerUser);
    return addedUser;
  }
}

module.exports = AddUserUseCase;
