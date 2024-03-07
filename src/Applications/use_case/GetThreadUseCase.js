/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository,
    commentLikeRepository, threadLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
    this._threadLikeRepository = threadLikeRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadExistance(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const threadLikeCounts = await this._threadLikeRepository.getLikeCountsByThreadId(threadId);

    thread.likeCounts = threadLikeCounts.length;

    for (const comment of comments) {
      const { id: commentId } = comment;
      if (comment.is_deleted) {
        comment.content = '**komentar telah dihapus**';
      }

      let commentReplies = await this._replyRepository.getRepliesByCommentId(commentId);
      let commentLikeCounts = await this._commentLikeRepository.getLikeCountsByCommentId(commentId);

      commentReplies = commentReplies.filter((reply) => reply.comment_id === commentId);
      commentLikeCounts = commentLikeCounts.filter((like) => like.comment_id === commentId);

      for (const reply of commentReplies) {
        if (reply.is_deleted) {
          reply.content = '**balasan telah dihapus**';
        }
      }

      comment.replies = commentReplies.map(({
        id, content, date, username,
      }) => ({
        id, content, date, username,
      }));

      comment.likeCounts = commentLikeCounts.length;
    }

    thread.comments = comments.map(({
      id, username, date, replies, content, likeCounts,
    }) => ({
      id,
      username,
      date,
      replies,
      content,
      likeCounts,
    }));

    return thread;
  }
}

module.exports = GetThreadUseCase;
