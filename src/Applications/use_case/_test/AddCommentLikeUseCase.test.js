const AddCommentLikeUseCase = require('../AddCommentLikeUseCase');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('The AddLikeUseCase class', () => {
  it('should orchestrates the addLike action correctly if the comment has not liked', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const { threadId, commentId } = useCaseParams;
    const owner = 'user-123';

    /** create dependencies of the use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();

    /** mock the required functions */
    mockCommentRepository.verifyCommentExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockLikeRepository.isCommentLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'like-123' }));

    /** create the use case instances */
    const getAddCommentLikeUseCase = new AddCommentLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await getAddCommentLikeUseCase.execute(owner, useCaseParams);

    // Assert
    expect(mockCommentRepository.verifyCommentExistance)
      .toHaveBeenCalledWith({ threadId, commentId });

    expect(mockLikeRepository.isCommentLiked)
      .toHaveBeenCalledWith({ owner, commentId });
    expect(mockLikeRepository.addLike)
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
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();

    /** mock the required functions */
    mockCommentRepository.verifyCommentExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockLikeRepository.isCommentLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.deleteLikeByOwnerAndCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** create the use case instances */
    const getAddCommentLikeUseCase = new AddCommentLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await getAddCommentLikeUseCase.execute(owner, useCaseParams);

    // Assert
    expect(mockCommentRepository.verifyCommentExistance)
      .toHaveBeenCalledWith({ threadId, commentId });

    expect(mockLikeRepository.isCommentLiked)
      .toHaveBeenCalledWith({ owner, commentId });
    expect(mockLikeRepository.deleteLikeByOwnerAndCommentId)
      .toHaveBeenCalledWith({ owner, commentId });
  });
});
