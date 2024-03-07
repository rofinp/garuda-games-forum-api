/* eslint-disable no-unused-vars */

class ThreadLikeRepository {
  async addThreadLike(owner, threadId) {
    throw new Error('THREAD_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteLikeByOwnerAndThreadId({ owner, threadId }) {
    throw new Error('THREAD_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikeCountsByThreadId(threadId) {
    throw new Error('THREAD_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async isThreadLiked({ owner, threadId }) {
    throw new Error('THREAD_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadLikeRepository;
