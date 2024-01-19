const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('The DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
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
    const mockCommentRepository = new CommentRepository();
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

    mockCommentRepository.verifyCommentExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAuthorization = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating the use case instance */
    const getDeleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    await getDeleteCommentUseCase.execute(useCaseParams, useCaseHeaders);

    // Assert
    expect(mockAuthenticationTokenManager.getAuthorizationToken)
      .toHaveBeenCalledWith(useCaseHeaders.authorization);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toHaveBeenCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(accessToken);

    expect(mockCommentRepository.verifyCommentExistance)
      .toHaveBeenCalledWith(useCaseParams);
    expect(mockCommentRepository.verifyCommentAuthorization)
      .toHaveBeenCalledWith({ owner: decodePayload.id, commentId: useCaseParams.commentId });
    expect(mockCommentRepository.deleteCommentByCommentId)
      .toHaveBeenCalledWith(useCaseParams.commentId);
  });
});
