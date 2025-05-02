const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const AuthRoutes = require("./routes/AuthRoutes.js");
const pool = require("./db.js");
const realPool = pool.pool

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/users", AuthRoutes);

realPool.getConnection((error, connection) => {
  if (error) {
    throw error;
  } else {
    console.log("connected");
    connection.release();
  }
});
app.listen(port, () => {
  console.log(`App is listening on the port: ${port}`);
});
