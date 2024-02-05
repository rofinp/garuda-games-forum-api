const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const RegisteredReply = require('../../Domains/replies/entities/RegisteredReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(owner, commentId, registerReply) {
    const { content } = registerReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: `INSERT INTO replies (id, comment_id, content, owner, date)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, content, owner`,
      values: [id, commentId, content, owner, date],
    };
    const result = await this._pool.query(query);
    return new RegisteredReply({ ...result.rows[0] });
  }

  async deleteReply(replyId) {
    const query = {
      text: `UPDATE replies
             SET is_deleted = true
             WHERE id = $1`,
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan atau sudah dihapus');
    }
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT replies.id, replies.comment_id, replies.content, users.username, replies.date, replies.is_deleted
             FROM replies
             INNER JOIN users ON replies.owner = users.id
             INNER JOIN comments ON replies.comment_id = comments.id
             WHERE replies.comment_id = $1
             ORDER BY replies.date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyReplyExistance({ threadId, commentId, replyId }) {
    const query = {
      text: `SELECT replies.id, comments.id AS comment_id, replies.is_deleted 
      FROM replies
      INNER JOIN users ON replies.owner = users.id
      INNER JOIN comments ON replies.comment_id = comments.id
      WHERE comments.thread_id = $1
      AND replies.comment_id = $2 
      AND replies.id = $3`,
      values: [threadId, commentId, replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount || result.rows[0].is_deleted) {
      throw new NotFoundError('balasan tidak ditemukan atau sudah dihapus');
    }
  }

  async verifyReplyAuthorization({ owner, replyId }) {
    const query = {
      text: `SELECT replies.id, users.id AS owner
             FROM replies
             INNER JOIN users ON replies.owner = users.id
             WHERE users.id = $1
             AND replies.id = $2`,
      values: [owner, replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('tidak dapat mengakses sumber ini, harap login terlebih dahulu');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
