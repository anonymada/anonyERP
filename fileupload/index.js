const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "*",
};

// Middleware de base
app.use(fileUpload({ createParentPath: true }));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Route proxy vers WebDAV
app.use(
  "/image",
  (req, res, next) => {
    if (req.method !== "GET") {
      return res.status(403).send("Hack not available");
    }
    next();
  },
  createProxyMiddleware({
    target: process.env.WEBDAV_HOST || "http://localhost:8080",
    changeOrigin: true,
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.WEBDAV_USER}:${process.env.WEBDAV_PASS}`
        ).toString("base64"),
    },
  })
);

// Route pour upload
app.post("/upload-file", async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).send({ message: "GLOBAL.BADREQUEST" });
    }

    const file = req.files.file;
    const filename = req.body.filename;

    // Enregistrer dans le dossier "data" (ou un volume monté vers WebDAV)
    file.mv("data/" + filename);

    return res.status(200).send({
      message: "GLOBAL.SAVED",
      data: {
        name: file.name,
        mimetype: file.mimetype,
        size: file.size,
        url: `http://${process.env.UPLOAD_HOST}:${process.env.PORT}/image/${filename}`,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

// Route racine
app.get("/", (req, res) => {
  res.json({ message: "fileuploader server 2.0" });
});

// Lancement du serveur
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
  console.log(`Utilise le serveur webdav ${port}`);
});
