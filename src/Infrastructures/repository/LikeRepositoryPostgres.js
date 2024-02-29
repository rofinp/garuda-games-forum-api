const LikeRepository = require('../../Domains/likes/LikeRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(owner, commentId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO likes (id, comment_id, owner)
             VALUES ($1, $2, $3)
             RETURNING id`,
      values: [id, commentId, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteLikeByLikeId(likeId) {
    const query = {
      text: 'DELETE FROM likes WHERE id = $1',
      values: [likeId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('like tidak ditemukan atau sudah dihapus');
    }
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rowCount;
  }

  async verifyLikeAuthorization({ owner, likeId }) {
    const query = {
      text: `SELECT likes.id, users.id AS owner
             FROM likes
             INNER JOIN users ON likes.owner = users.id
             WHERE users.id = $1
             AND likes.id = $2`,
      values: [owner, likeId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('tidak dapat mengakses sumber ini, harap login terlebih dahulu');
    }
  }
}

module.exports = LikeRepositoryPostgres;
