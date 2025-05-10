require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const promisePool = pool.promise();

const now = new Date();
const sevenDaysLater = JSON.stringify(
  new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
)
  .slice(1, 19)
  .replace("T", " ");

// SIGNUP
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const [rows] = await promisePool.execute(
      "SELECT * FROM users WHERE users.username = ?",
      [username]
    );
    console.log(rows)
    if (rows.length) {
      return res.status(409).send("Username already exists");
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    // Insert into database
    await promisePool.execute(
      "INSERT INTO users(username, password, refreshToken, expiration) VALUES (?, ?, ?, ?)",
      [username, hash, refreshToken, sevenDaysLater]
    );


    const [rows1] = await promisePool.execute("select * from users;");
    console.log(rows1);
    // Tokens
    const user = { id: rows[1].id, username: username }
    const accessToken = generateToken("access", user);
    const refreshToken = generateToken("refresh", user);

    // Cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ accessToken: accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows2] = await promisePool.execute(
      "select * from users where users.username = ?",
      [username]
    );


    if (!rows2.length) {
      return res.send("Wrong username or password!").status(404);
    }
    const correctPassword = await bcrypt.compare(password, rows2[0].password);

    if (correctPassword) {
      const user = { id: rows2[0].id, username: username };
      console.log(user);
      const accessToken = generateToken("access", user);
      const refreshToken = generateToken("refresh", user);
      
      await promisePool.execute("update users set refreshToken = ? where username = ?", [refreshToken, username])
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      console.log
      res.json({ accessToken: accessToken }).status(202);
    }

  } catch (error) {
    if (error) throw error;
  }
});
function generateToken(type, user) {
  if (type === "access") {
    return jwt.sign(
      { id: user.id, username: user.username },
      process.env.PRIVATE_ACCESS_TOKEN_KEY,
      { expiresIn: "15m" }
    );
  } else if (type === "refresh") {
    return jwt.sign(
      { id: user.id, username: user.username },
      process.env.PRIVATE_REFRESH_TOKEN_KEY
    );
  }
  return "NOT A VALID TYPE";
}

module.exports = { router: router, TokenFn: generateToken };
