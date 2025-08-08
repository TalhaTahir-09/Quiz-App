require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/UserModel.js");

// Date
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
    // console.log("Users", users)
    const userExists = await User.findOne({ where: { username: username } })
    // console.log("Users1", users)

    if (userExists) {
      return res.status(409).send("Username already exists");
    }
    // Tokens\
    const user = { username: username }
    const accessToken = generateToken("access", user);
    const refreshToken = generateToken("refresh", user);

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    // Insert into database

    await User.create({ username: username, password: hash, refreshToken: refreshToken, expiration: sevenDaysLater })
    // Cookies
    cookieIntializer(res, refreshToken, accessToken);
    return res.status(200).send("Success");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log("Ran Login")

  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ where: { username: username } })

    if (!userExists) {
      return res.send("Wrong username or password!").status(404);
    }
    const userData = userExists.dataValues;
    const correctPassword = await bcrypt.compare(password, userData.password);
    if (correctPassword) {
      const user = { username: username };
      const accessToken = generateToken("access", user);
      const refreshToken = generateToken("refresh", user);
      // Update token
      const updated = await User.update({ refreshToken: refreshToken }, { where: { username: username } })
      console.log("Token Updated: " + Boolean(updated))
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

module.exports = { router: router, TokenFn: generateToken, cookieFn: cookieIntializer };
