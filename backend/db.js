require("dotenv").config();
const sql = require("mysql2");

const connection = sql.createConnection({
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
});
module.exports = connection;
