/* eslint-disable no-unused-vars */

class CommentLikeRepository {
  async addCommentLike(owner, commentId) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteLikeByOwnerAndCommentId({ owner, commentId }) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikeCountsByCommentId(commentId) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async isCommentLiked({ owner, commentId }) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentLikeRepository;
