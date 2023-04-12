const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const https = require("https");
const fs = require("fs");
const mime = require("mime-types");

// config access to .env file
require("dotenv").config();

// initialize express app
const app = express();

// setting cors options
var corsOptions = {
  origin: "*",
};

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//add other middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// route for upload single file
app.post("/upload-file", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "file") to retrieve the uploaded file
      let file = req.files.file;
      let filename = req.body.filename;

      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      file.mv("data/" + filename + ".png");

      //send response
      res.send({
        status: true,
        message: "File is uploaded",
        data: {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size,
          url: process.env.UPLOAD_HOST + filename + ".png",
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// route for server root
app.get("/", (req, res) => {
  res.json({ message: "fileuploader server" });
});

//define server port
const port = process.env.PORT || 30001;

// create https server
https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(port, (error) => {
    if (error) throw err;
    console.log(`%c  Server is running on port ${port}.`, "color: green");
  });
