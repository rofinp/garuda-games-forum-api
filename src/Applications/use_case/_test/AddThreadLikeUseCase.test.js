const AddThreadLikeUseCase = require('../AddThreadLikeUseCase');
const ThreadLikeRepository = require('../../../Domains/likes/ThreadLikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('The AddThreadLikeUseCase class', () => {
  it('should orchestrates the addLike action correctly if the comment has not liked', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const { threadId } = useCaseParams;
    const owner = 'user-123';

    /** create dependencies of the use case */
    const mockThreadLikeRepository = new ThreadLikeRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mock the required functions */
    mockThreadRepository.verifyThreadExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadLikeRepository.isThreadLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockThreadLikeRepository.addThreadLike = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'like-123' }));

    /** create the use case instances */
    const getAddThreadLikeUseCase = new AddThreadLikeUseCase({
      threadLikeRepository: mockThreadLikeRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await getAddThreadLikeUseCase.execute(owner, threadId);

    // Assert
    expect(mockThreadRepository.verifyThreadExistance)
      .toHaveBeenCalledWith(threadId);

    expect(mockThreadLikeRepository.isThreadLiked)
      .toHaveBeenCalledWith({ owner, threadId });
    expect(mockThreadLikeRepository.addThreadLike)
      .toHaveBeenCalledWith(owner, threadId);
  });

  it('should orchestrates the deleteLike action correctly if the comment has been liked', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const { threadId } = useCaseParams;
    const owner = 'user-123';

    /** create dependencies of the use case */
    const mockThreadLikeRepository = new ThreadLikeRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mock the required functions */
    mockThreadRepository.verifyThreadExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadLikeRepository.isThreadLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockThreadLikeRepository.deleteLikeByOwnerAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** create the use case instances */
    const getAddThreadLikeUseCase = new AddThreadLikeUseCase({
      threadLikeRepository: mockThreadLikeRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await getAddThreadLikeUseCase.execute(owner, threadId);

    // Assert
    expect(mockThreadRepository.verifyThreadExistance)
      .toHaveBeenCalledWith(threadId);

    expect(mockThreadLikeRepository.isThreadLiked)
      .toHaveBeenCalledWith({ owner, threadId });
    expect(mockThreadLikeRepository.deleteLikeByOwnerAndThreadId)
      .toHaveBeenCalledWith({ owner, threadId });
  });
});
