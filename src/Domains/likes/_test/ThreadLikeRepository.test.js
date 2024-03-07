const ThreadLikeRepository = require('../ThreadLikeRepository');

describe('a ThreadLikeRepository interface', () => {
  it('should throw an error when invoking abstract behaviour', async () => {
    // Arrange
    const threadLikeRepository = new ThreadLikeRepository();

    // Action & Assert
    await expect(threadLikeRepository.addThreadLike('', ''))
      .rejects.toThrow('THREAD_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadLikeRepository.deleteLikeByOwnerAndThreadId({}))
      .rejects.toThrow('THREAD_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadLikeRepository.getLikeCountsByThreadId(''))
      .rejects.toThrow('THREAD_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadLikeRepository.isThreadLiked({}))
      .rejects.toThrow('THREAD_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
