const ThreadRepository = require('../ThreadRepository');

describe('a ThreadRepository interface', () => {
  it('should throw an error when invoking abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    await expect(threadRepository.addThread({}))
      .rejects
      .toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(threadRepository.getThreadById(''))
      .rejects
      .toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
