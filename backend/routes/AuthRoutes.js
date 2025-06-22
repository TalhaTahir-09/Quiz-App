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
    // Tokens
    const user = { username: username }
    const accessToken = generateToken("access", user);
    const refreshToken = generateToken("refresh", user);

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    // Insert into database
    await promisePool.execute(
      "INSERT INTO users(username, password, refreshToken, expiration) VALUES (?, ?, ?, ?)",
      [username, hash, refreshToken, sevenDaysLater]
    );


    const [rows1] = await promisePool.execute("select * from users;");
    console.log(rows1);


    // Cookies
    cookieIntializer(res, refreshToken, accessToken);
    return res.status(200);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log("Ran Login")

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
    console.log("1correct")

    if (correctPassword) {
      console.log("correct")
      const user = { username: username };
      const accessToken = generateToken("access", user);
      const refreshToken = generateToken("refresh", user);

      const [rows] = await promisePool.execute("update users set refreshToken = ? where username = ?", [refreshToken, username])
      console.log(rows)
      cookieIntializer(res, refreshToken, accessToken);
      return res.status(202).send("Successs");
    } else {
      return res.status(401).send("Incorrect username or password!")
    }
  } catch (error) {
    console.log(error)
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
      process.env.PRIVATE_REFRESH_TOKEN_KEY,
    );
  }
  return "NOT A VALID TYPE";
}
function cookieIntializer(res, refreshToken, accessToken) {

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 15 * 60 * 1000,
  });
}

console.log(sevenDaysLater)
module.exports = { router: router, TokenFn: generateToken, cookieFn: cookieIntializer };
