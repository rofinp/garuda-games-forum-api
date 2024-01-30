const AddReplyUseCase = require('../AddReplyUseCase');
const RegisterReply = require('../../../Domains/replies/entities/RegisterReply');
const RegisteredReply = require('../../../Domains/replies/entities/RegisteredReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('The AddReplyUseCase class', () => {
  it('should orchestrates the addReply action correctly', async () => {
    // Arrange
    const decodePayload = {
      id: 'user-123',
    };

    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    const useCasePayload = {
      content: 'This is your mom reply',
    };

    const accessToken = 'access_token';

    const useCaseHeaders = {
      authorization: `Bearer ${accessToken}`,
    };

    const mockRegisteredReply = new RegisteredReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: decodePayload.id,
    });

    /** creating dependencies of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking required function */
    mockAuthenticationTokenManager.getAuthorizationToken = jest.fn()
      .mockImplementation(() => Promise.resolve(accessToken));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: decodePayload.id,
      }));

    mockCommentRepository.verifyCommentExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredReply));

    /** creating the use case instance */
    const getAddReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const registeredReply = await getAddReplyUseCase
      .execute(useCasePayload, useCaseParams, useCaseHeaders);

    // Assert
    expect(registeredReply).toStrictEqual(mockRegisteredReply);

    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toHaveBeenCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.getAuthorizationToken)
      .toHaveBeenCalledWith(useCaseHeaders.authorization);

    expect(mockCommentRepository.verifyCommentExistance)
      .toHaveBeenCalledWith({
        threadId: useCaseParams.threadId,
        commentId: useCaseParams.commentId,
      });

    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(new RegisterReply({
      commentId: useCaseParams.commentId,
      content: useCasePayload.content,
      owner: decodePayload.id,
    }));
  });
});
