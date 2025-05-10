require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const generateToken = (require("./AuthRoutes.js")).TokenFn
const pool = require('../db.js')
const promisePool = pool.promise();
// Token Authentication

function authToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send("No Token");
  }
  jwt.verify(token, process.env.PRIVATE_ACCESS_TOKEN_KEY, (err, user) => {
    if (err) {
      if (err?.name === "TokenExpiredError") {
        res.status(403).send("Token expired")
      }
      else {
        throw err
      }
    }
    req.user = user;
    console.log(user)
    next();
  });
}
// Post routes
router.get("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const userData = jwt.verify(refreshToken, process.env.PRIVATE_REFRESH_TOKEN_KEY)
  const accessToken = generateToken("access", { id: userData.id, username: userData.name })
  return res.status(200).json({ accessToken: accessToken });
})
router.post("/score", authToken, async (req, res) => {
  const { difficulty } = req.body;
  let score = Number.parseInt(req.body.score)
  if (score === 0) {
    return res.status(200).send("Updated");
  };
  await promisePool.execute("INSERT INTO scores(user_id, difficulty, score) VALUES (?, ?, ?)", [req.user.id, difficulty, score])

  return res.status(200).send("Stored")
})

// Get routes
router.get("/profile", authToken, async (req, res) => {
  const [rows] = await promisePool.execute("SELECT * FROM scores WHERE scores.user_id=?", [req.user.id])
  const scoreObj = { "easy": 0, "medium": 0, "hard": 0, "attempts": rows.length }
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
  console.log(scoreObj);
  res.status(200).json(scoreObj);
})
router.get('/leaderboard',authToken, async (req, res) => {
  const [rows] = await promisePool.execute("SELECT * FROM scores")
  const [user] =  await promisePool.execute("SELECT * FROM users")
  let userData = []
  user.forEach((value) => {
    userData.push({id: value.id, username: value.username})
  })
  
  res.status(200).json({scores: rows, userData: userData})
})
router.get("/home", authToken, (req, res) => {
  res.send("Authorized").status(200);
});
router.get("/quiz-config", authToken, (req, res) => {
  res.send("Authorized").status(200);
});

module.exports = router;
