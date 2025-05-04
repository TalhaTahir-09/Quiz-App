const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const AuthRoutes = require("./routes/AuthRoutes.js");
const AppRoutes = require("./routes/AppRoutes.js");
const cookieParser = require("cookie-parser");

app.use(cors({ origin: "http://localhost:5173" }));
const pool = require("./db.js");
app.use("/app", AppRoutes);
app.use(cookieParser());
app.use(express.json());
app.use("/users", AuthRoutes);

pool.getConnection((error, connection) => {
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
