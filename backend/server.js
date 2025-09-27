const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const AuthRoutes = require("./routes/AuthRoutes.js").router;
const AppRoutes = require("./routes/AppRoutes.js");
const cookieParser = require("cookie-parser");
const Model = require("./models/UserModel.js")
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const pool = require("./db.js");
app.use("/users", AuthRoutes);
app.use("/app", AppRoutes);

pool.getConnection((error, connection) => {
  if (error) {
    console.log(error)
    throw error;
  } else {
    console.log("connected");
    connection.release();
  }
});
async function dbConfig() {
  await Model.sequelize.sync();
  console.log("All models have been synchronized")
}
dbConfig();
app.listen(port, () => {
  console.log(`App is listening on the port: ${port}`);
});
