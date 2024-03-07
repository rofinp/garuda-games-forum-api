/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository,
    commentLikeRepository, threadLikeRepository, replyLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
    this._threadLikeRepository = threadLikeRepository;
    this._replyLikeRepository = replyLikeRepository;
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
      commentReplies = commentReplies.filter((reply) => reply.comment_id === commentId);

      let commentLikeCounts = await this._commentLikeRepository.getLikeCountsByCommentId(commentId);
      commentLikeCounts = commentLikeCounts.filter((like) => like.comment_id === commentId);

      for (const reply of commentReplies) {
        const { id: replyId } = reply;
        if (reply.is_deleted) {
          reply.content = '**balasan telah dihapus**';
        }

        let replyLikeCounts = await this._replyLikeRepository.getLikeCountsByReplyId(replyId);
        replyLikeCounts = replyLikeCounts.filter((like) => like.reply_id === replyId);
        reply.likeCounts = replyLikeCounts.length;
      }

      comment.replies = commentReplies.map(({
        id, content, created_at: date, username, likeCounts,
      }) => ({
        id,
        content,
        date,
        username,
        likeCounts,
      }));

      comment.likeCounts = commentLikeCounts.length;
    }

    thread.comments = comments.map(({
      id, username, created_at: date, replies, content, likeCounts,
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
