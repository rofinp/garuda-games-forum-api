/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
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

  pgm.addConstraint('comment_likes', 'fk_likes.comment_id_comments.id', {
    foreignKeys: {
      columns: 'comment_id',
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('comment_likes', 'fk_likes.owner_users.id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comment_likes');
  pgm.dropConstraint('comment_likes', 'fk_likes.comment_id_comments.id');
  pgm.dropConstraint('comment_likes', 'fk_likes.owner_users.id');
};
