const AddLikeUseCase = require('../AddLikeUseCase');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('The AddLikeUseCase class', () => {
  it('should orchestrates the addLike action correctly', async () => {
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

    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'like-123' }));

    /** create the use case instances */
    const getAddLikeUseCase = new AddLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await getAddLikeUseCase.execute(owner, useCaseParams);

    // Assert
    expect(mockCommentRepository.verifyCommentExistance)
      .toHaveBeenCalledWith({ threadId, commentId });

    expect(mockLikeRepository.addLike)
      .toHaveBeenCalledWith(owner, commentId);
  });
});
