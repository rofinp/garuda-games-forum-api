const RegisterComment = require('../../../Domains/comments/entities/RegisterComment');
const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('The AddCommentUseCase', () => {
  it('should orchestrates the addComment action correctly', async () => {
    // Arrange
    const decodePayload = {
      id: 'user-123',
    };

    const useCaseParams = {
      threadId: 'thread-123',
    };

    const useCasePayload = {
      content: 'What a comment',
    };

    const accessToken = 'access_token';

    const useCaseHeaders = {
      authorization: `Bearer ${accessToken}`,
    };

    const mockRegisteredComment = new RegisteredComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: decodePayload.id,
    });

    /** creating dependencies of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking required function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'untitled thread',
        body: 'hello world',
        date: '2021-08-08T07:19:09.775Z',
        username: 'rofinugraha',
      }));

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredComment));

    mockAuthenticationTokenManager.getAuthorizationToken = jest.fn()
      .mockImplementation(() => Promise.resolve(accessToken));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(accessToken));
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: decodePayload.id,
      }));

    /** creating the use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const registeredComment = await getCommentUseCase
      .execute(useCasePayload, useCaseParams, useCaseHeaders);

    // Assert
    expect(registeredComment).toStrictEqual(mockRegisteredComment);

    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toHaveBeenCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.getAuthorizationToken)
      .toHaveBeenCalledWith(useCaseHeaders.authorization);

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCaseParams.threadId);

    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(new RegisterComment({
      threadId: useCaseParams.threadId,
      content: useCasePayload.content,
      owner: decodePayload.id,
    }));
  });
});
