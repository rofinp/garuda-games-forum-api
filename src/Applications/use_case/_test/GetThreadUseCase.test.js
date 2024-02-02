const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('The GetThreadUseCase', () => {
  it('should orchestrates the getThreadById action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const threadComments = [
      {
        id: 'comment-123',
        threadId: useCaseParams.threadId,
        content: 'Almonds, what a comment',
        owner: 'user-123',
        username: 'rofinugraha',
        date: '2024-04-04',
        isDeleted: false,
        replies: [],
      },
    ];

    const thread = {
      id: useCaseParams.threadId,
      title: 'The Almonds',
      body: 'I love you so much Almond',
      owner: 'rofinugraha',
      date: '2023-03-03',
      comments: [],
    };

    const reply = [
      {
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'This is your mom reply',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
        isDeleted: false,
      },
      {
        id: 'reply-313',
        commentId: 'comment-123',
        content: 'This is your dad reply',
        owner: 'user-313',
        date: '2021-08-08T07:19:09.775Z',
        isDeleted: false,
      },
    ];

    /** creating dependencies of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking required function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(threadComments));
    mockCommentRepository.verifyCommentExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        { ...reply[0], username: 'rofinugraha' },
        { ...reply[1], username: 'ashleygraham' },
      ]));

    /** creating the use case instance */
    const getGetThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getGetThreadUseCase.execute(useCaseParams);

    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-await-in-loop */
    for (const comment of detailThread.comments) {
      const { id: commentId } = comment;
      const commentReplies = await mockReplyRepository.getRepliesByCommentId(commentId);
      comment.replies = commentReplies.map(({
        id, content, date, username,
      }) => ({
        id, content, date, username,
      }));
    }

    /* Hapus beberapa properti dari setiap objek dalam array comments */
    const formattedComments = detailThread.comments.map(({
      id, username, date, replies, content,
    }) => ({
      id,
      username,
      date,
      replies,
      content,
    }));

    // Assert
    expect(detailThread.comments).toEqual(formattedComments);
    expect(detailThread).toEqual({
      ...thread, comments: formattedComments,
    });

    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toHaveBeenCalledWith(useCaseParams.threadId);
    expect(mockReplyRepository.getRepliesByCommentId)
      .toHaveBeenCalledWith('comment-123');

    detailThread.comments.forEach((comment) => {
      expect(comment).toHaveProperty('replies');
    });
  });
});
