const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate the delete reply action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    const { threadId, commentId, replyId } = useCaseParams;
    const owner = 'user-123';

    /** creating dependencies of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking required function */
    mockReplyRepository.verifyReplyExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyAuthorization = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating the use case instance */
    const getDeleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await getDeleteReplyUseCase.execute(owner, useCaseParams);

    // Assert
    expect(mockReplyRepository.verifyReplyExistance)
      .toHaveBeenCalledWith({ threadId, commentId, replyId });
    expect(mockReplyRepository.verifyReplyAuthorization)
      .toHaveBeenCalledWith({ owner, replyId });
    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(replyId);
  });
});
