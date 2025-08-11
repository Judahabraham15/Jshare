
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "UPLOADS");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

//? Simple in-memory metadata store:
//? key = storedFilename (what multer saves), value = { originalName, size, type }
const fileMetadata = {};

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

//* serve uploaded files
app.use("/files", express.static(uploadDir));

//* multer storage (save files into the same uploadDir)
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    //* keep file extension from original name
    cb(null, file.fieldname + "-" + uniqueName + path.extname(file.originalname));
  },
});

const Uploads = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, //* 100MB limit bro
});

//! UPLOAD ROUTE
app.post("/upload", Uploads.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No Files Uploaded" });
    }

    //* Save original name & metadata in memory keyed by the stored filename
    fileMetadata[req.file.filename] = {
      originalName: req.file.originalname,
      size: req.file.size,
      type: path.extname(req.file.originalname).toLowerCase().replace(".", "") || "unknown",
    };

    //* return helpful info to the frontend (including originalName)
    const fileLink = {
      originalName: req.file.originalname,
      link: `http://localhost:3001/files/${req.file.filename}`,
      filename: req.file.filename,
    };

    res.status(200).json(fileLink);
  } catch (error) {
    console.error("Upload error:", error);
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "File too large" });
      }
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || "Upload Failed" });
  }
});

//! FILE INFO ROUTE
app.get("/file-info/:filename", (req, res) => {
  try {
    const filenameParam = req.params.filename;

    // ?security: use basename to avoid directory traversal (../)
    const safeFilename = path.basename(filenameParam);

    const filePath = path.join(uploadDir, safeFilename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    const stats = fs.statSync(filePath);

    // ?lookup metadata from the in-memory map
    const meta = fileMetadata[safeFilename];

    res.status(200).json({
      // ?if we have originalName saved, return it; otherwise fallback to stored filename
      name: meta ? meta.originalName : safeFilename,
      size: stats.size,
      //? return stored "type" (extension) or fallback to ext from stored filename
      type: meta ? meta.type : path.extname(safeFilename).toLowerCase().replace(".", "") || "unknown",
    });
  } catch (error) {
    console.error("file-info error:", error);
    res.status(500).json({ error: "Failed to fetch file info" });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
