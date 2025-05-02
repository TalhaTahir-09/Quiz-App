require("dotenv").config();
const sql = require("mysql2");
const pool = sql.createPool({
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
});

module.exports = { PromisePool: pool.promise(), pool: pool };
