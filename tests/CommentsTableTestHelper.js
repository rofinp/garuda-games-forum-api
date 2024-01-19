/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    content = 'I love you so much Almonds',
    owner = 'user-123',
    date = '2021-08-08T07:19:09.775Z',
    isDeleted = false,
  }) {
    const query = {
      text: `INSERT INTO comments (id, thread_id, content, owner, date, is_deleted)
             VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [id, threadId, content, owner, date, isDeleted],
    };
    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
