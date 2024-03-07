const ReplyLikeRepository = require('../../Domains/likes/ReplyLikeRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ReplyLikeRepositoryPostgres extends ReplyLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplyLike(owner, replyId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO reply_likes (id, reply_id, owner)
             VALUES ($1, $2, $3)
             RETURNING id`,
      values: [id, replyId, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteLikeByOwnerAndReplyId({ owner, replyId }) {
    const query = {
      text: 'DELETE FROM reply_likes WHERE owner = $1 AND reply_id = $2',
      values: [owner, replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('like tidak ditemukan atau sudah dihapus');
    }
  }

  async getLikeCountsByReplyId(replyId) {
    const query = {
      text: 'SELECT * FROM reply_likes WHERE reply_id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async isReplyLiked({ owner, replyId }) {
    const query = {
      text: 'SELECT * FROM reply_likes WHERE owner = $1 AND reply_id = $2',
      values: [owner, replyId],
    };
    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }
}

module.exports = ReplyLikeRepositoryPostgres;
