const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const AuthRoutes = require("./routes/AuthRoutes.js").router;
const AppRoutes = require("./routes/AppRoutes.js");
const cookieParser = require("cookie-parser");

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const pool = require("./db.js");


app.use("/users", AuthRoutes);
app.use("/app", AppRoutes);

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
