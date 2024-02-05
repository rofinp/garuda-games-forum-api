/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'untitled',
    body = 'hello world',
    owner = 'user-123',
    date = '2021-08-08T07:19:09.775Z',
  }) {
    const query = {
      text: `INSERT INTO threads (id, title, body, owner, date) 
             VALUES ($1, $2, $3, $4, $5)`,
      values: [id, title, body, owner, date],
    };
    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
