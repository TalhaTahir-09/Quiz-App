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
        console.log("Token expired")
        return res.status(403).send("Token expired")
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
router.get("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
  const { username } = jwt.verify(refreshToken, process.env.PRIVATE_REFRESH_TOKEN_KEY)
  } catch (error) {
    if(error) console.log(error.message)
    return res.status(400).send("Not the same user")  

  }
  const [db] = await promisePool.execute("SELECT * FROM USERS WHERE users.username=? LIMIT 1", [username])
  if (refreshToken === db[0].refreshToken) {  
    console.log("Ran refresh")
    const accessToken = generateToken("access", { username: username })
    const newRefreshToken = generateToken("refresh", { username: username })
    await promisePool.execute("update users set refreshToken = ? where username = ?", [newRefreshToken, username])
    console.log(db, refreshToken)
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ accessToken: accessToken });
  }

})


router.post("/score", authToken, async (req, res) => {
  const { difficulty } = req.body;
  let score = Number.parseInt(req.body.score)
  console.log("Ran")
  // if (score === 0) {
  //   return res.send("Updated").status(200);
  // };
  console.log(req.user.username)
  await promisePool.execute("INSERT INTO scores(user_name, difficulty, score) VALUES (?, ?, ?)", [req.user.username, difficulty, score])
  return res.status(200).send("Stored")
})

// Get routes
router.get("/profile", authToken, async (req, res) => {
  const userData = await req.user;
  const [rows] = await promisePool.execute("SELECT * FROM scores WHERE scores.user_name=?", [userData.username])
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
  console.log("TEEK")
  console.log(scoreObj);
  res.status(200).json(scoreObj);
})
router.get('/leaderboard', authToken, async (req, res) => {
  const [rows] = await promisePool.execute("SELECT * FROM scores")
  const [user] = await promisePool.execute("SELECT * FROM users")
  let userData = []
  user.forEach((value) => {
    userData.push({ id: value.id, username: value.username })
  })

  res.status(200).json({ scores: rows, userData: userData })
})
router.get("/home", authToken, async (req, res) => {
  res.status(200).send("Authorized");
});
router.get("/quiz-config", authToken, (req, res) => {
  res.send("Authorized").status(200);
});

module.exports = router;
