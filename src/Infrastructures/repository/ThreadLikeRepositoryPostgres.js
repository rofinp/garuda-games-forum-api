const ThreadLikeRepository = require('../../Domains/likes/ThreadLikeRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadLikeRepositoryPostgres extends ThreadLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadLike(owner, threadId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO thread_likes (id, thread_id, owner)
             VALUES ($1, $2, $3)
             RETURNING id`,
      values: [id, threadId, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteLikeByOwnerAndThreadId({ owner, threadId }) {
    const query = {
      text: 'DELETE FROM thread_likes WHERE owner = $1 AND thread_id = $2',
      values: [owner, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('like tidak ditemukan atau sudah dihapus');
    }
  }

  async getLikeCountsByThreadId(threadId) {
    const query = {
      text: 'SELECT * FROM thread_likes WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async isThreadLiked({ owner, threadId }) {
    const query = {
      text: 'SELECT * FROM thread_likes WHERE owner = $1 AND thread_id = $2',
      values: [owner, threadId],
    };
    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }
}

module.exports = ThreadLikeRepositoryPostgres;
