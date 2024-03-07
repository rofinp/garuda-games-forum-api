const ReplyLikeRepository = require('../ReplyLikeRepository');

describe('a ReplyLikeRepository interface', () => {
  it('should throw an error when invoking abstract behaviour', async () => {
    // Arrange
    const replyLikeRepository = new ReplyLikeRepository();

    // Action & Assert
    await expect(replyLikeRepository.addReplyLike('', ''))
      .rejects.toThrow('REPLY_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyLikeRepository.deleteLikeByOwnerAndReplyId({}))
      .rejects.toThrow('REPLY_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyLikeRepository.getLikeCountsByReplyId(''))
      .rejects.toThrow('REPLY_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyLikeRepository.isReplyLiked({}))
      .rejects.toThrow('REPLY_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
