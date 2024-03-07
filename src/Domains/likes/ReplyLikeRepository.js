/* eslint-disable no-unused-vars */

class ReplyLikeRepository {
  async addReplyLike(owner, replyId) {
    throw new Error('REPLY_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteLikeByOwnerAndReplyId({ owner, replyId }) {
    throw new Error('REPLY_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikeCountsByReplyId(replyId) {
    throw new Error('REPLY_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async isReplyLiked({ owner, replyId }) {
    throw new Error('REPLY_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplyLikeRepository;
