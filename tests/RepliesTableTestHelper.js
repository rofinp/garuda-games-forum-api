/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    content = 'This is your mom reply',
    owner = 'user-123',
    createdAt = '2021-08-08T07:19:09.775Z',
    isDeleted = false,
  }) {
    const query = {
      text: `INSERT INTO replies (id, comment_id, content, owner, created_at, is_deleted)
             VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [id, commentId, content, owner, createdAt, isDeleted],
    };
    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
