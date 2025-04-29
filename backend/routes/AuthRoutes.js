const express = require("express");
const router = express.Router();
const connection = require('../db.js')

router.post("/signup", (req, res) => {
  console.log(req.body);
  res.status(200).send("Message recieved!");
});

module.exports = router;
