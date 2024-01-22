class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    const thread = await this._threadRepository.getThreadById(threadId);
    thread.comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const formattedComments = thread.comments.map(({
      id, username, date, content,
    }) => ({
      id,
      username,
      date,
      content,
    }));
    thread.comments = formattedComments;
    return thread;
  }
}

module.exports = GetThreadUseCase;
