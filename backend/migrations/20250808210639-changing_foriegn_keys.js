'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('scores', 'scores_user_id_foreign');
    await queryInterface.removeColumn('scores', 'user_id');
    await queryInterface.addColumn('scores', 'user_name', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'username'
      },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('scores', 'scores_user_id_foreign');
    await queryInterface.removeColumn('scores', 'user_name');
    await queryInterface.addColumn('scores', 'user_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });
  }
};
