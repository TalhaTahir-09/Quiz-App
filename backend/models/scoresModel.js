const knex = require('../db/knex.js')

async function returnAllScores() {
    return await knex('scores').select();
}
async function scoreInsert(username, difficulty, score) {
    return knex('scores').insert({ user_name: username, difficulty, score })
}
async function scoresSearch(username) {
    return await knex('scores').select().where({ user_name: username })
}
module.exports = { scoreInsert, scoresSearch, returnAllScores }
