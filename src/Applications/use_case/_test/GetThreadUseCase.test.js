const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
describe('The GetThreadUseCase', () => {
  it('should orchestrates the getThreadById action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const { threadId } = useCaseParams;

    const thread = {
      id: threadId,
      title: 'The Almonds',
      body: 'I love you so much Almond',
      username: 'rofinugraha',
      date: '2023-03-03',
    };

    const threadComments = [
      {
        id: 'comment-123',
        thread_id: threadId,
        content: 'Almonds, what a comment',
        username: 'rofinugraha',
        date: '2024-04-04',
        is_deleted: false,
      },
      {
        id: 'comment-313',
        thread_id: threadId,
        content: 'Hazelnut, what a comment',
        username: 'ashleygraham',
        date: '2024-04-04',
        is_deleted: true,
      },
    ];

    const commentReplies = [
      {
        id: 'reply-123',
        comment_id: 'comment-123',
        content: 'This is your mom reply',
        username: 'rofinugraha',
        date: '2021-08-08T07:19:09.775Z',
        is_deleted: true,
      },
      {
        id: 'reply-313',
        comment_id: 'comment-123',
        content: 'This is your dad reply',
        username: 'ashleygraham',
        date: '2021-08-08T07:19:09.775Z',
        is_deleted: false,
      },
    ];

    /** creating dependencies of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking required function */
    mockThreadRepository.verifyThreadExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(threadComments));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(commentReplies));

    /** creating the use case instance */
    const getGetThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    for (const comment of threadComments) {
      const { id: commentId } = comment;
      if (comment.is_deleted) {
        comment.content = '**komentar telah dihapus**';
      }

      let replies = await mockReplyRepository.getRepliesByCommentId(commentId);

      replies = replies.filter((reply) => reply.comment_id === commentId);

      for (const reply of replies) {
        if (reply.is_deleted) {
          reply.content = '**balasan telah dihapus**';
        }
      }
      comment.replies = replies.map(({
        id, content, date, username,
      }) => ({
        id, content, date, username,
      }));
    }

    /* Hapus beberapa properti dari setiap objek dalam array comments */
    const formattedComments = threadComments.map(({
      id, username, date, replies, content,
    }) => ({
      id,
      username,
      date,
      replies,
      content,
    }));

    // Action
    const detailThread = await getGetThreadUseCase.execute(useCaseParams);

    // Assert
    expect(mockThreadRepository.verifyThreadExistance)
      .toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(threadId);

    expect(mockCommentRepository.getCommentsByThreadId)
      .toHaveBeenCalledWith(threadId);

    expect(mockReplyRepository.getRepliesByCommentId)
      .toHaveBeenCalledWith('comment-123');

    expect(detailThread).toEqual({
      ...thread,
      comments: formattedComments,
    });

    expect(detailThread).toHaveProperty('comments');

    detailThread.comments.forEach((comment) => {
      expect(comment).toHaveProperty('replies');
    });
  });
});
