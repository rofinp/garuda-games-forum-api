const AddReplyLikeUseCase = require('../AddReplyLikeUseCase');
const ReplyLikeRepository = require('../../../Domains/likes/ReplyLikeRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('The AddReplyLikeUseCase class', () => {
  it('should orchestrates the addLike action correctly if the reply has not liked', async () => {
    // Arrange
    const useCaseParams = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const { threadId, replyId, commentId } = useCaseParams;
    const owner = 'user-123';

    /** create dependencies of the use case */
    const mockReplyLikeRepository = new ReplyLikeRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mock the required functions */
    mockReplyRepository.verifyReplyExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyLikeRepository.isReplyLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockReplyLikeRepository.addReplyLike = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'like-123' }));

    /** create the use case instances */
    const getAddReplyLikeUseCase = new AddReplyLikeUseCase({
      replyLikeRepository: mockReplyLikeRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await getAddReplyLikeUseCase.execute(owner, commentId, threadId, replyId);

    // Assert
    expect(mockReplyRepository.verifyReplyExistance)
      .toHaveBeenCalledWith({ threadId, commentId, replyId });

    expect(mockReplyLikeRepository.isReplyLiked)
      .toHaveBeenCalledWith({ owner, replyId });
    expect(mockReplyLikeRepository.addReplyLike)
      .toHaveBeenCalledWith(owner, replyId);
  });

  it('should orchestrates the deleteLike action correctly if the reply has been liked', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    const { threadId, commentId, replyId } = useCaseParams;
    const owner = 'user-123';

    /** create dependencies of the use case */
    const mockReplyLikeRepository = new ReplyLikeRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mock the required functions */
    mockReplyRepository.verifyReplyExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyLikeRepository.isReplyLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyLikeRepository.deleteLikeByOwnerAndReplyId = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** create the use case instances */
    const getAddReplyLikeUseCase = new AddReplyLikeUseCase({
      replyLikeRepository: mockReplyLikeRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await getAddReplyLikeUseCase.execute(owner, commentId, threadId, replyId);

    // Assert
    expect(mockReplyRepository.verifyReplyExistance)
      .toHaveBeenCalledWith({ threadId, commentId, replyId });

    expect(mockReplyLikeRepository.isReplyLiked)
      .toHaveBeenCalledWith({ owner, replyId });
    expect(mockReplyLikeRepository.deleteLikeByOwnerAndReplyId)
      .toHaveBeenCalledWith({ owner, replyId });
  });
});
