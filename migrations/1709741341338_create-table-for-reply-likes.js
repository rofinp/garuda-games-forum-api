/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('reply_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    reply_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    liked_at: {
      type: 'TIMESTAMP WITH TIME ZONE',
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  pgm.addConstraint('reply_likes', 'fk_likes.reply_id_replies.id', {
    foreignKeys: {
      columns: 'reply_id',
      references: 'replies(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('reply_likes', 'fk_likes.owner_users.id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('reply_likes');
  pgm.dropConstraint('reply_likes', 'fk_likes.reply_id_replies.id');
  pgm.dropConstraint('reply_likes', 'fk_likes.owner_users.id');
};
