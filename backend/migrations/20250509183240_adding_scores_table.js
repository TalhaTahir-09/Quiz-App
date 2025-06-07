exports.up = function(knex) {
  return knex.schema.createTable("scores", (table) => {
    table.increments('id').notNullable();
    table.integer('user_id').unsigned().notNullable().references("id").inTable('users').onDelete('CASCADE')
    table.enum('difficulty', ['easy', 'medium', 'hard']).notNullable();
    table.integer('score').notNullable();
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("scores")
};
