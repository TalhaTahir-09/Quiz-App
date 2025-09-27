'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addConstraint('users', {
        fields: ['username'],
        type: 'unique',
        name: 'idx_users_username'
      }),
      queryInterface.addIndex('scores', ['user_name'], {
        name: 'idx_scores_user_name'
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeConstraint('users', 'idx_users_username'),
      queryInterface.removeIndex('scores', 'idx_scores_user_name')
    ]);
  }
};
