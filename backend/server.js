const express = require("express");
const app = express();
const cors = require('cors')
const port = 3000;
const AuthRoutes = require('./routes/AuthRoutes.js')
const connection = require('./db.js')

app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json());
app.use("/users", AuthRoutes)

connection.connect(function(err){
    if(err) throw err;
    console.log("Connected!")
})

app.listen(port, () => {
  console.log(`App is listening on the port: ${port}`);
});
