/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    await this._threadRepository.verifyThreadExistance(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    for (const comment of comments) {
      const { id: commentId } = comment;
      if (comment.is_deleted) {
        comment.content = '**komentar telah dihapus**';
      }

      let commentReplies = await this._replyRepository.getRepliesByCommentId(commentId);
      let commentLikes = await this._likeRepository.getLikeCountByCommentId(commentId);

      commentReplies = commentReplies.filter((reply) => reply.comment_id === commentId);
      commentLikes = commentLikes.filter((like) => like.comment_id === commentId);

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

      comment.likeCount = commentLikes.length;
    }

    thread.comments = comments.map(({
      id, username, date, replies, content, likeCount,
    }) => ({
      id,
      username,
      date,
      replies,
      content,
      likeCount,
    }));

    return thread;
  }
}

module.exports = GetThreadUseCase;
