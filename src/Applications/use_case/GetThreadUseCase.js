/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const formattedComments = comments.map(({
      id, username, date, replies, content,
    }) => ({
      id,
      username,
      date,
      replies,
      content,
    }));

    thread.comments = formattedComments;

    for (const comment of formattedComments) {
      const { id: commentId } = comment;
      const commentReplies = await this._replyRepository.getRepliesByCommentId(commentId);
      comment.replies = commentReplies.map(({
        id, content, date, username,
      }) => ({
        id, content, date, username,
      }));
    }

    return thread;
  }
}

module.exports = GetThreadUseCase;
