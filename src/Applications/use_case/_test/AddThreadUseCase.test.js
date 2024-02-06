const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrates the addThread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Almonds',
      body: 'I love you so much Almond',
    };

    const owner = 'user-123';

    const mockRegisteredThread = new RegisteredThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner,
    });

    /** creating dependencies of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking required function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new RegisteredThread({
        id: mockRegisteredThread.id,
        title: mockRegisteredThread.title,
        owner: mockRegisteredThread.owner,
      })));

    /** creating the use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const registeredThread = await getThreadUseCase.execute(useCasePayload, owner);

    // Assert
    expect(registeredThread).toEqual(new RegisteredThread(mockRegisteredThread));

    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(owner, new RegisterThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});
