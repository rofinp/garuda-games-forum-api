const RegisterComment = require('../../../Domains/comments/entities/RegisterComment');
const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('The AddCommentUseCase', () => {
  it('should orchestrates the addComment action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const { threadId } = useCaseParams;
    const owner = 'user-123';

    const useCasePayload = {
      content: 'What a comment',
    };

    const mockRegisteredComment = new RegisteredComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner,
    });

    /** creating dependencies of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking required function */
    mockThreadRepository.verifyThreadExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredComment));

    /** creating the use case instance */
    const getAddCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const registeredComment = await getAddCommentUseCase
      .execute(owner, threadId, useCasePayload);

    // Assert
    expect(registeredComment).toStrictEqual(mockRegisteredComment);

    expect(mockThreadRepository.verifyThreadExistance).toHaveBeenCalledWith(threadId);

    expect(mockCommentRepository.addComment)
      .toHaveBeenCalledWith(owner, threadId, new RegisterComment({
        content: useCasePayload.content,
      }));
  });
});
