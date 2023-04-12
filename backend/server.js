const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

// cors options
var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//let access to assets by url
app.use(express.static(path.join(__dirname, "assets/uploads")));

// database
const db = require("./app/models");
const Role = db.role;

// db.sequelize.sync({force: true}).then(()=> initial() ) will drop the table if it already exists
db.sequelize
  .sync()
  .then(() => {})
  .catch((error) => console.log(error));

// set port, listen for requests
const PORT = process.env.PORT || 3000;

// create https server
https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(PORT, (error) => {
    if (error) throw err;
    console.log(`%c  Server is running on port ${PORT}.`, "color: green");
  });

// root route
app.get("/", (req, res) => {
  res.json({ message: "Api for web app by Anonymada" });
});

// app routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/employee.routes")(app);
require("./app/routes/employeelog.routes")(app);
require("./app/routes/role.routes")(app);
