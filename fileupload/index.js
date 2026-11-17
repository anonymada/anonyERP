const express = require("express");
const https = require("https");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
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

// Serve files from the volume shared with WebDAV; express.static supports GET and HEAD.
app.use("/image", express.static(path.join(__dirname, "data")));

// Route pour upload
app.post("/upload-file", async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).send({ message: "GLOBAL.BADREQUEST" });
    }

    const file = req.files.file;
    const filename = path.basename(String(req.body.filename || file.name));

    await file.mv(path.join(__dirname, "data", filename));
    const publicUploadUrl = (
      process.env.PUBLIC_UPLOAD_URL ||
      "https://192.168.2.254:8001"
    ).replace(/\/$/, "");

    return res.status(200).send({
      message: "GLOBAL.SAVED",
      data: {
        name: file.name,
        mimetype: file.mimetype,
        size: file.size,
        url: `${publicUploadUrl}/image/${encodeURIComponent(filename)}`,
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
const tlsCertCandidates = [
  process.env.TLS_CERT_FILE,
  "/run/secrets/frontend_tls_cert",
  path.join(__dirname, "cert.pem"),
  path.join(__dirname, "..", "backend", "cert.pem"),
].filter(Boolean);
const tlsKeyCandidates = [
  process.env.TLS_KEY_FILE,
  "/run/secrets/frontend_tls_key",
  path.join(__dirname, "key.pem"),
  path.join(__dirname, "..", "backend", "key.pem"),
].filter(Boolean);
const tlsCertPath = tlsCertCandidates.find((candidate) => fs.existsSync(candidate));
const tlsKeyPath = tlsKeyCandidates.find((candidate) => fs.existsSync(candidate));

if (!tlsCertPath || !tlsKeyPath) {
  console.error("Certificat ou clé TLS introuvable pour le serveur de fichiers");
  process.exit(1);
}

try {
  https
    .createServer(
      {
        cert: fs.readFileSync(tlsCertPath),
        key: fs.readFileSync(tlsKeyPath),
      },
      app
    )
    .listen(port, () => {
      console.log(`Serveur HTTPS en écoute sur le port ${port}`);
      console.log(`Utilise le serveur webdav ${port}`);
    });
} catch (error) {
  console.error("Impossible de charger le certificat TLS du serveur de fichiers:", error);
  process.exit(1);
}
