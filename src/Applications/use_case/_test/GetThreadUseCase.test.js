const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
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
      },
      {
        id: 'comment-313',
        threadId: useCaseParams.threadId,
        content: 'Hazelnut, what a comment',
        owner: 'user-313',
        username: 'ashleygraham',
        date: '2024-04-04',
        isDeleted: false,
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

    /** creating dependencies of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking required function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(threadComments));
    mockCommentRepository.verifyCommentExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating the use case instance */
    const getGetThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getGetThreadUseCase.execute(useCaseParams);

    /* Hapus beberapa properti dari setiap objek dalam array comments */
    const formattedComments = detailThread.comments.map(({
      id, username, date, content,
    }) => ({
      id,
      username,
      date,
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
  });
});
