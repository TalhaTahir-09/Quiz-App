const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// Token Authentication

function authToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send("No Token");
  }
  jwt.verify(token, process.env.PRIVATE_ACCESS_TOKEN_KEY, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send("Token is expired");
      } else throw err;
    }
    req.user = user;
    next();
  });
}


// Get routes
router.get("/home", (req, res) => {
  res.send("Authorized").status(200);
});
router.get("/quiz-config", (req, res) => {
  res.send("Authorized").status(200);
});

module.exports = router;
