const AddReplyUseCase = require('../AddReplyUseCase');
const RegisterReply = require('../../../Domains/replies/entities/RegisterReply');
const RegisteredReply = require('../../../Domains/replies/entities/RegisteredReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('The AddReplyUseCase class', () => {
  it('should orchestrates the addReply action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const { threadId, commentId } = useCaseParams;
    const owner = 'user-123';

    const useCasePayload = {
      content: 'This is your mom reply',
    };

    const mockRegisteredReply = new RegisteredReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner,
    });

    /** creating dependencies of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking required function */
    mockCommentRepository.verifyCommentExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(new RegisteredReply({
        id: mockRegisteredReply.id,
        content: mockRegisteredReply.content,
        owner: mockRegisteredReply.owner,
      })));

    /** creating the use case instance */
    const getAddReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const registeredReply = await getAddReplyUseCase
      .execute(owner, useCaseParams, useCasePayload);

    // Assert
    expect(registeredReply).toStrictEqual(mockRegisteredReply);

    expect(mockCommentRepository.verifyCommentExistance).toHaveBeenCalledWith({
      threadId,
      commentId,
    });

    expect(mockReplyRepository.addReply)
      .toHaveBeenCalledWith(owner, commentId, new RegisterReply({
        content: useCasePayload.content,
      }));
  });
});
