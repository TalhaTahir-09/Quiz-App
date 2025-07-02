const knex = require('../db/knex.js')

async function returnAllUsers() {
    return await knex('users').select();
}
async function returnAllScores() {
    return await knex('scores').select();
}

async function findUserByName(username) {
    const row = await knex('users').where('username', username).select().first();
    return row;
}
async function insertUser(username, hashPassword, refreshToken, expiration) {
    return await knex('users').insert({ username, password: hashPassword, refreshToken, expiration })
}
async function loginUpdate(refreshToken, username) {
    return await knex('users').update({ 'refreshToken': refreshToken }).where({ username })
}
async function scoreInsert(username, difficulty, score) {
    return knex('scores').insert({ user_name: username, difficulty, score })
}
async function scoresSearch(username) {
    return await knex('scores').select().where({ user_name: username })
}

module.exports = { findUserByName, insertUser, returnAllUsers, loginUpdate, scoreInsert, scoresSearch, returnAllScores }