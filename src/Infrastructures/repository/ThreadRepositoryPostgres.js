const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(owner, registerThread) {
    const { title, body } = registerThread;
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

  async getThreadById(threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username 
             FROM threads
             INNER JOIN users ON threads.owner = users.id
             WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async verifyThreadExistance(threadId) {
    const query = {
      text: `SELECT threads.id AS thread_id 
             FROM threads 
             WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
