/* eslint-disable no-unused-vars */

class LikeRepository {
  async addLike(owner, commentId) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteLikeByOwnerAndCommentId({ owner, commentId }) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikeCountByCommentId(commentId) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async isCommentLiked({ owner, commentId }) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeRepository;
