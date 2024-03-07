const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentLikeRepository = require('../../../Domains/likes/CommentLikeRepository');
const ThreadLikeRepository = require('../../../Domains/likes/ThreadLikeRepository');
const ReplyLikeRepository = require('../../../Domains/likes/ReplyLikeRepository');
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

    const commentLikes = [
      {
        id: 'like-123',
        comment_id: 'comment-123',
        owner: 'user-123',
      },
      {
        id: 'like-123',
        comment_id: 'comment-123',
        owner: 'user-321',
      },
    ];

    const threadLikes = [
      {
        id: 'like-123',
        thread_id: 'thread-123',
        owner: 'user-123',
      },
      {
        id: 'like-123',
        thread_id: 'thread-123',
        owner: 'user-321',
      },
    ];

    const replyLikes = [
      {
        id: 'like-123',
        reply_id: 'reply-123',
        owner: 'user-123',
      },
      {
        id: 'like-123',
        reply_id: 'reply-123',
        owner: 'user-321',
      },
    ];

    /** creating dependencies of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockThreadLikeRepository = new ThreadLikeRepository();
    const mockReplyLikeRepository = new ReplyLikeRepository();

    /** mocking required function */
    mockThreadRepository.verifyThreadExistance = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(threadComments));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(commentReplies));

    mockCommentLikeRepository.getLikeCountsByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(commentLikes));

    mockThreadLikeRepository.getLikeCountsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(threadLikes));

    mockReplyLikeRepository.getLikeCountsByReplyId = jest.fn()
      .mockImplementation(() => Promise.resolve(replyLikes));

    /** creating the use case instance */
    const getGetThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikeRepository: mockCommentLikeRepository,
      threadLikeRepository: mockThreadLikeRepository,
      replyLikeRepository: mockReplyLikeRepository,
    });

    const threadLikeCounts = await mockThreadLikeRepository.getLikeCountsByThreadId(threadId);
    thread.likeCounts = threadLikeCounts.length;

    for (const comment of threadComments) {
      const { id: commentId } = comment;
      if (comment.is_deleted) {
        comment.content = '**komentar telah dihapus**';
      }

      let replies = await mockReplyRepository.getRepliesByCommentId(commentId);
      let commentLikeCounts = await mockCommentLikeRepository.getLikeCountsByCommentId(commentId);

      replies = replies.filter((reply) => reply.comment_id === commentId);
      commentLikeCounts = commentLikeCounts.filter((like) => like.comment_id === commentId);

      for (const reply of replies) {
        const { id: replyId } = reply;
        if (reply.is_deleted) {
          reply.content = '**balasan telah dihapus**';
        }

        let replyLikeCounts = await mockReplyLikeRepository.getLikeCountsByReplyId(replyId);
        replyLikeCounts = replyLikeCounts.filter((like) => like.reply_id === replyId);
        reply.likeCounts = replyLikeCounts.length;
      }

      comment.replies = replies.map(({
        id, content, date, username, likeCounts,
      }) => ({
        id, content, date, username, likeCounts,
      }));

      comment.likeCounts = commentLikeCounts.length;
    }

    /* Hapus beberapa properti dari setiap objek dalam array comments */
    const formattedComments = threadComments.map(({
      id, username, date, replies, content, likeCounts,
    }) => ({
      id,
      username,
      date,
      replies,
      content,
      likeCounts,
    }));

    // Action
    const detailThread = await getGetThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.verifyThreadExistance)
      .toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(threadId);
    expect(mockThreadLikeRepository.getLikeCountsByThreadId)
      .toHaveBeenCalledWith('thread-123');

    expect(mockCommentRepository.getCommentsByThreadId)
      .toHaveBeenCalledWith(threadId);
    expect(mockCommentLikeRepository.getLikeCountsByCommentId)
      .toHaveBeenCalledWith('comment-123');

    expect(mockReplyRepository.getRepliesByCommentId)
      .toHaveBeenCalledWith('comment-123');

    expect(detailThread).toEqual({
      ...thread,
      comments: formattedComments,
    });

    expect(detailThread).toHaveProperty('comments');
    expect(detailThread).toHaveProperty('likeCounts');

    detailThread.comments.forEach((comment) => {
      expect(comment).toHaveProperty('likeCounts');
      expect(comment).toHaveProperty('replies');
    });
  });
});
