const AddCommentLikeUseCase = require('../AddCommentLikeUseCase');
const CommentLikeRepository = require('../../../Domains/likes/CommentLikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('The AddCommentLikeUseCase class', () => {
  it('should orchestrates the addLike action correctly if the comment has not liked', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const { threadId, commentId } = useCaseParams;
    const owner = 'user-123';

    /** create dependencies of the use case */
    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentRepository = new CommentRepository();

    /** mock the required functions */
    mockCommentRepository.verifyCommentExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentLikeRepository.isCommentLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentLikeRepository.addCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'like-123' }));

    /** create the use case instances */
    const getAddCommentLikeUseCase = new AddCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await getAddCommentLikeUseCase.execute(owner, commentId, threadId);

    // Assert
    expect(mockCommentRepository.verifyCommentExistance)
      .toHaveBeenCalledWith({ threadId, commentId });

    expect(mockCommentLikeRepository.isCommentLiked)
      .toHaveBeenCalledWith({ owner, commentId });
    expect(mockCommentLikeRepository.addCommentLike)
      .toHaveBeenCalledWith(owner, commentId);
  });

  it('should orchestrates the deleteLike action correctly if the comment has been liked', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const { threadId, commentId } = useCaseParams;
    const owner = 'user-123';

    /** create dependencies of the use case */
    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentRepository = new CommentRepository();

    /** mock the required functions */
    mockCommentRepository.verifyCommentExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentLikeRepository.isCommentLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentLikeRepository.deleteLikeByOwnerAndCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** create the use case instances */
    const getAddCommentLikeUseCase = new AddCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await getAddCommentLikeUseCase.execute(owner, commentId, threadId);

    // Assert
    expect(mockCommentRepository.verifyCommentExistance)
      .toHaveBeenCalledWith({ threadId, commentId });

    expect(mockCommentLikeRepository.isCommentLiked)
      .toHaveBeenCalledWith({ owner, commentId });
    expect(mockCommentLikeRepository.deleteLikeByOwnerAndCommentId)
      .toHaveBeenCalledWith({ owner, commentId });
  });
});
