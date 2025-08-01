require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const generateToken = (require("./AuthRoutes.js")).TokenFn;
const pool = require('../db.js');
const { cookieFn } = require("./AuthRoutes.js");
const promisePool = pool.promise();
const cookieIntializer = (require("./AuthRoutes.js")).cookieFn;
const AuthModel = require("../models/Auth.js")
// Token Authentication

function authToken(req, res, next) {
  const refreshToken = req.cookies.refreshToken;
  const token = req.cookies.accessToken;
  if (!token) {
    req.user = refreshAccessToken(req, res, refreshToken);
    return next();
  }

  jwt.verify(token, process.env.PRIVATE_ACCESS_TOKEN_KEY, (err, user) => {
    if (err) {
      if (err?.name === "TokenExpiredError") {
        req.user = refreshAccessToken(req, res, refreshToken);
        return next()
      }
      else {
        throw err
      }
    }
    req.user = user;
    next();
  });
}
// Post routes
async function refreshAccessToken(req, res, refreshToken) {
  console.log(refreshToken)
  try {
    const { username } = jwt.verify(refreshToken, process.env.PRIVATE_REFRESH_TOKEN_KEY)
    const row = await AuthModel.findUserByName(username);
    if (refreshToken === row.refreshToken) {
      console.log("Ran refresh")
      const accessToken = generateToken("access", { username: username })
      const newRefreshToken = generateToken("refresh", { username: username })
      await AuthModel.loginUpdate(newRefreshToken, username);
      cookieFn(res, refreshToken, accessToken)
    }
    console.log("username: " + username)
    return { username: username };
  } catch (error) {
    if (error) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
      })
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
      })
      return res.status(400).send("Not the same user")
    }
  }
}
router.get("/signout", authToken, async (req, res) => {
  const { username } = await req.user;
  await AuthModel.loginUpdate("", username)
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  })
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  })
  res.send("Hello").status(200)
})


router.post("/score", authToken, async (req, res) => {
  const { difficulty } = req.body;
  const { username } = await req.user
  let score = Number.parseInt(req.body.score)
  if (score === 0) {
    return res.send("Updated").status(200);
  };
  console.log(username)
  await AuthModel.scoreInsert(username, difficulty, score)
  // await promisePool.execute("INSERT INTO scores(user_name, difficulty, score) VALUES (?, ?, ?)", [username, difficulty, score])
  console.log("Stored")
  return res.send("Updated").status(200);

})

// Get routes
router.get("/profile", authToken, async (req, res) => {
  const { username } = await req.user;
  console.log(username)
  const rows = await AuthModel.scoresSearch(username)
  console.log(rows)
  let scoreObj = { "easy": 0, "medium": 0, "hard": 0, "attempts": rows.length }
  rows.map((value) => {
    if (value.difficulty === "easy") {
      scoreObj.easy += value.score
    } else if (value.difficulty === "medium") {
      scoreObj.medium += value.score
    } else {
      scoreObj.hard += value.score
    }
  }
  )
  res.status(200).json(scoreObj);
})
router.get('/leaderboard', authToken, async (req, res) => {
  const rows = await AuthModel.returnAllScores()
  const user = await AuthModel.returnAllUsers()
  let userData = []
  user.forEach((value) => {
    userData.push({ id: value.id, username: value.username })
  })

  res.status(200).json({ scores: rows, userData: userData })
})
router.get("/protected-route", authToken, async (req, res) => {
  res.status(200).send("Authorized");
});
router.get("/quiz-config", authToken, (req, res) => {
  res.send("Authorized").status(200);
});

module.exports = router;
