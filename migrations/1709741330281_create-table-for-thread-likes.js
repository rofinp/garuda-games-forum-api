/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('thread_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
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

  pgm.addConstraint('thread_likes', 'fk_likes.thread_id_threads.id', {
    foreignKeys: {
      columns: 'thread_id',
      references: 'threads(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('thread_likes', 'fk_likes.owner_users.id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('thread_likes');
  pgm.dropConstraint('thread_likes', 'fk_likes.thread_id_threads.id');
  pgm.dropConstraint('thread_likes', 'fk_likes.owner_users.id');
};
