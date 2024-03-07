/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadLikesTableTestHelper = {
  async addThreadLike({
    id = 'like-123', threadId = 'thread-123', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO thread_likes (id, thread_id, owner) VALUES ($1, $2, $3)',
      values: [id, threadId, owner],
    };

    await pool.query(query);
  },

  async findThreadLikeById(id) {
    const query = {
      text: 'SELECT * FROM thread_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_likes WHERE 1=1');
  },
};

module.exports = ThreadLikesTableTestHelper;
