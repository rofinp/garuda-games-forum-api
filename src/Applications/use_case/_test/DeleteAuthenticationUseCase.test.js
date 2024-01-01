const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const DeleteAuthenticationUseCase = require('../DeleteAuthenticationUseCase');

describe('The DeleteAuthenticationUseCase', () => {
  it('should throw an error if the use case payload does not contain a refresh token', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

    // Action & Assert
    await expect(deleteAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrow('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw an error if the refresh token is not a string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123,
    };
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

    // Action & Assert
    await expect(deleteAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrow('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrate the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };
    const mockAuthenticationRepository = new AuthenticationRepository();
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await deleteAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
