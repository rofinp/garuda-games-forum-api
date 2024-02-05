const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('The DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const { threadId, commentId } = useCaseParams;
    const owner = 'user-123';

    /** creating dependencies of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking required function */
    mockCommentRepository.verifyCommentExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAuthorization = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating the use case instance */
    const getDeleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await getDeleteCommentUseCase.execute(owner, useCaseParams);

    // Assert
    expect(mockCommentRepository.verifyCommentExistance)
      .toHaveBeenCalledWith({ threadId, commentId });
    expect(mockCommentRepository.verifyCommentAuthorization)
      .toHaveBeenCalledWith({ owner, commentId });
    expect(mockCommentRepository.deleteCommentByCommentId)
      .toHaveBeenCalledWith(commentId);
  });
});
