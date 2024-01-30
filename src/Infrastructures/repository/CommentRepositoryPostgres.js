const CommentRepository = require('../../Domains/comments/CommentRepository');
const RegisteredComment = require('../../Domains/comments/entities/RegisteredComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._idGenerator = idGenerator;
    this._pool = pool;
  }

  async addComment(registerComment) {
    const { threadId, content, owner } = registerComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `INSERT INTO comments (id, thread_id, content, owner, date)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, content, owner`,
      values: [id, threadId, content, owner, date],
    };

    const result = await this._pool.query(query);
    return new RegisteredComment({ ...result.rows[0] });
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.*, users.username
             FROM comments
             INNER JOIN users ON comments.owner = users.id
             WHERE comments.thread_id = $1
             ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    /* eslint-disable camelcase */
    const formattedComments = result.rows.map(({
      is_deleted, thread_id, ...rest
    }) => ({
      ...rest,
      threadId: thread_id,
      isDeleted: is_deleted,
    }));

    return formattedComments;
  }

  async deleteCommentByCommentId(commentId) {
    const query = {
      text: `UPDATE comments
             SET is_deleted = true, content = '**komentar telah dihapus**'
             WHERE id = $1`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan atau sudah dihapus');
    }
  }

  async verifyCommentExistance({ threadId, commentId }) {
    const query = {
      text: `SELECT comments.id, threads.id AS thread_id, comments.is_deleted
             FROM comments
             INNER JOIN threads ON comments.thread_id = threads.id
             WHERE threads.id = $1 AND comments.id = $2`,
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0 || result.rows[0].is_deleted) {
      throw new NotFoundError('komentar tidak ditemukan atau sudah dihapus');
    }
  }

  async verifyCommentAuthorization({ owner, commentId }) {
    const query = {
      text: `SELECT comments.id, users.id AS owner
             FROM comments
             INNER JOIN users ON comments.owner = users.id
             WHERE users.id = $1 
             AND comments.id = $2`,
      values: [owner, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('tidak dapat mengakses sumber ini, harap login terlebih dahulu');
    }
  }
}

module.exports = CommentRepositoryPostgres;
