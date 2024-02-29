const LikeRepository = require('../LikeRepository');

describe('a LikeRepository interface', () => {
  it('should throw an error when invoking abstract behaviour', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    await expect(likeRepository.addLike('', ''))
      .rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.deleteLikeByOwnerAndCommentId({}))
      .rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.getLikeCountByCommentId(''))
      .rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.isCommentLiked({}))
      .rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
