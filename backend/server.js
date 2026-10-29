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
// const Role = db.role;

// set port, listen for requests
const PORT = process.env.PORT || 3000;

// root route
app.get("/", (req, res) => {
  res.json({ message: "Api for web app by Anonymada 01" });
});

// app routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/employee.routes")(app);
require("./app/routes/employeelog.routes")(app);
require("./app/routes/role.routes")(app);

async function initialize() {
  await db.role.bulkCreate(
    [
      { id: 1, name: "admin" },
      { id: 2, name: "moderator" },
      { id: 3, name: "user" },
    ],
    { updateOnDuplicate: ["name"] }
  );
}

async function startServer() {
  try {
    await db.sequelize.sync();
    await initialize();

    https
      .createServer(
        {
          key: fs.readFileSync("key.pem"),
          cert: fs.readFileSync("cert.pem"),
        },
        app
      )
      .listen(PORT, (error) => {
        if (error) throw error;
        console.log(`%c  Server is running on port ${PORT}.`, "color: green");
      });
  } catch (error) {
    console.error("Unable to synchronize database:", error);
    process.exitCode = 1;
  }
}

startServer();
