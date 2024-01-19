const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrates the addThread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Almonds',
      body: 'I love you so much Almond',
    };

    const decodePayload = {
      id: 'user-123',
    };

    const mockRegisteredThread = new RegisteredThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    const accessToken = 'access_token';

    const useCaseHeaders = {
      authorization: `Bearer ${accessToken}`,
    };

    /** creating dependencies of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking required function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredThread));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(accessToken));
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: decodePayload.id }));
    mockAuthenticationTokenManager.getAuthorizationToken = jest.fn()
      .mockImplementation(() => Promise.resolve(accessToken));

    /** creating the use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const registeredThread = await getThreadUseCase.execute(useCasePayload, useCaseHeaders);

    // Assert
    expect(registeredThread).toStrictEqual(new RegisteredThread({
      ...mockRegisteredThread,
    }));

    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toHaveBeenCalledWith(accessToken);

    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new RegisterThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: decodePayload.id,
    }));

    expect(mockAuthenticationTokenManager.getAuthorizationToken)
      .toHaveBeenCalledWith(useCaseHeaders.authorization);
  });
});
