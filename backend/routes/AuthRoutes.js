require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const promisePool = pool.PromisePool;

const now = new Date();
const sevenDaysLater = JSON.stringify(
  new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
)
  .slice(1, 19)
  .replace("T", " ");

// SIGNUP
router.post("/signup", async (req, res) => {
  const user = req.body;
  const { username, password } = req.body;

  try {
    // Check if user exists
    const [rows] = await promisePool.execute(
      "SELECT * FROM users WHERE users.username = ?",
      [user.username]
    );
    if (rows.length) {
      return res.status(409).send("Username already exists");
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Tokens
    const accessToken = generateToken("access", user);
    const refreshToken = generateToken("refresh", user);

    // Insert into database
    await promisePool.execute(
      "INSERT INTO users(username, password, refreshToken, expiration) VALUES (?, ?, ?, ?)",
      [username, hash, refreshToken, sevenDaysLater]
    );

    return res.status(201).send("User Created");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

function generateToken(type, user) {
  if (type === "access") {
    return jwt.sign(
      { username: user.username },
      process.env.PRIVATE_ACCESS_TOKEN_KEY,
      { expiresIn: "15m" }
    );
  } else if (type === "refresh") {
    return jwt.sign(
      { username: user.username }, 
      process.env.PRIVATE_REFRESH_TOKEN_KEY
    );
  }
  return "NOT A VALID TYPE";
}

module.exports = router;
