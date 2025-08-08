const knex = require('../db/knex.js')

async function returnAllUsers() {
    return await knex('users').select();
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

module.exports = { findUserByName, insertUser, returnAllUsers, loginUpdate }