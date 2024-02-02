const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(registerThread) {
    const { title, body, owner } = registerThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `INSERT INTO threads (id, title, body, owner, date) 
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, title, owner`,
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);
    return new RegisteredThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username 
             FROM threads
             INNER JOIN users ON threads.owner = users.id
             WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return result.rows[0];
  }

  // async getRepliesByThreadId(id) {
  //   const query = {
  //     text: `SELECT replies.id, comments.id AS comment_id, replies.content, users.username, replies.date, replies.is_deleted
  //            FROM replies
  //            INNER JOIN users ON replies.owner = users.id
  //            INNER JOIN comments ON replies.comment_id = comments.id
  //            WHERE comments.thread_id = $1
  //            ORDER BY replies.date ASC`,
  //     values: [id],
  //   };
  //   const result = await this._pool.query(query);

  //   /* eslint-disable camelcase */
  //   const formattedReplies = result.rows.map(({ is_deleted, comment_id, ...rest }) => ({
  //     ...rest,
  //     commentId: comment_id,
  //     isDeleted: is_deleted,
  //   }));
  //   return formattedReplies;
  // }
}

module.exports = ThreadRepositoryPostgres;
