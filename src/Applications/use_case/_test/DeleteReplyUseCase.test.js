const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate the delete reply action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    const decodePayload = {
      username: 'rofinugraha',
      id: 'user-123',
    };

    const accessToken = 'access_token';

    const useCaseHeaders = {
      authorization: `Bearer ${accessToken}`,
    };

    /** creating dependencies of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking required function */
    mockAuthenticationTokenManager.getAuthorizationToken = jest.fn()
      .mockImplementation(() => Promise.resolve(accessToken));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(accessToken));
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({
        username: decodePayload.username,
        id: decodePayload.id,
      }));

    mockReplyRepository.verifyReplyExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyAuthorization = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating the use case instance */
    const getDeleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    await getDeleteReplyUseCase.execute(useCaseParams, useCaseHeaders);

    // Assert
    expect(mockAuthenticationTokenManager.getAuthorizationToken)
      .toHaveBeenCalledWith(useCaseHeaders.authorization);
    expect(mockAuthenticationTokenManager.verifyAccessToken)
      .toHaveBeenCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.decodePayload)
      .toHaveBeenCalledWith(accessToken);

    expect(mockReplyRepository.verifyReplyExistance)
      .toHaveBeenCalledWith(useCaseParams);
    expect(mockReplyRepository.verifyReplyAuthorization)
      .toHaveBeenCalledWith({ owner: decodePayload.id, replyId: useCaseParams.replyId });
  });
});
