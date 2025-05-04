/**
 */
exports.up = function(knex) {
    return knex.schema.alterTable("users", function(table){
        table.string('refreshToken').alter();
    })
  
};

exports.down = function(knex) {
    return knex.schema.alterTable("users", function(table){
        table.string('refreshToken').notNullable().alter();;
    })
};
