exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary().notNullable();
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
    table.string('refreshToken').notNullable();
    table.string('expiration').notNullable();
  });
};


exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
