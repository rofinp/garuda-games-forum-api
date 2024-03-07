/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyLikesTableTestHelper = {
  async addReplyLike({
    id = 'like-123', replyId = 'reply-123', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO reply_likes (id, reply_id, owner) VALUES ($1, $2, $3)',
      values: [id, replyId, owner],
    };

    await pool.query(query);
  },

  async findReplyLikeById(id) {
    const query = {
      text: 'SELECT * FROM reply_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM reply_likes WHERE 1=1');
  },
};

module.exports = ReplyLikesTableTestHelper;
