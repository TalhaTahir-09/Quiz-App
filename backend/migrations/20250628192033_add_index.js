exports.up = function (knex) {
    return Promise.all([
        knex.schema.alterTable("users", function (table) {
            table.unique('username', 'idx_users_username');
        }),
        knex.schema.alterTable("scores", function (table) {
            table.index('user_name', 'idx_scores_user_name');
        })
    ])


};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.alterTable("users", function(table) {
            table.dropUnique(['username'], 'idx_users_username')
        }),
        
        knex.schema.alterTable("scores", function (table) {
            table.dropIndex('user_name', 'idx_scores_user_name');
        })
    ])
};
