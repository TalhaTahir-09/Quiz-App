require("dotenv").config();
const express = require("express");
const router = express.Router();
const connection = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const now = new Date();
const sevenDaysLater = JSON.stringify(
  new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
)
  .slice(1, 19)
  .replace("T", " ");

// SIGNUP
router.post("/signup", (req, res) => {
  const user = req.body;
  connection.execute(
    "SELECT * FROM users WHERE users.username = ?",
    [user.username],
    (err, result) => {
      if (err) throw err;
      if (result.length) {
        return res.status(409).send("Username already exists");
      }
    }
  );
  bcrypt.hash(user.password, 10, (err, hash) => {
    const accessToken = generateToken("access", user);
    const refreshToken = generateToken("refresh", user);
    // connection.query(
    //   "INSERT INTO users(username, password, refreshToken, expiration) VALUES (?, ?, ?, ?)",
    //   [user.username, hash, refreshToken, sevenDaysLater]
    // );
  });
});

function generateToken(type, user) {
  if (type === "access") {
    return jwt.sign(
      { usename: user.usename },
      process.env.PRIVATE_ACCESS_TOKEN_KEY,
      { expiresIn: "15m" }
    );
  } else if (type === "refresh") {
    return jwt.sign(
      { usename: user.usename },
      process.env.PRIVATE_REFRESH_TOKEN_KEY
    );
  }
  return "NOT A VALID TYPE";
}

module.exports = router;
