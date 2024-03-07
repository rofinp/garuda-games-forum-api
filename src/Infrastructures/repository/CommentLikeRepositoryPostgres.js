const CommentLikeRepository = require('../../Domains/likes/CommentLikeRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentLike(owner, commentId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO comment_likes (id, comment_id, owner)
             VALUES ($1, $2, $3)
             RETURNING id`,
      values: [id, commentId, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteLikeByOwnerAndCommentId({ owner, commentId }) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE owner = $1 AND comment_id = $2',
      values: [owner, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('like tidak ditemukan atau sudah dihapus');
    }
  }

  async getLikeCountsByCommentId(commentId) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async isCommentLiked({ owner, commentId }) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE owner = $1 AND comment_id = $2',
      values: [owner, commentId],
    };
    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }
}

module.exports = CommentLikeRepositoryPostgres;
