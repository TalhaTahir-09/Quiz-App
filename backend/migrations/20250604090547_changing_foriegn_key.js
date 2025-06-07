exports.up = function (knex) {
    return knex.schema.alterTable("scores", function (table) {
        table.dropForeign('user_id');
        table.dropColumn('user_id');     
        table.string('user_name').notNullable()
            .references('username').inTable('users').onDelete('CASCADE');
    });
};
exports.down = function (knex) {
    return knex.schema.alterTable("scores", function (table) {
        table.dropForeign('user_name');  
        table.dropColumn('user_name'); 
        table.integer('user_id').unsigned().notNullable()
            .references("id").inTable('users').onDelete('CASCADE');
    });
};
