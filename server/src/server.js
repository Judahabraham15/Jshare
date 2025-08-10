// server.js (replace your file with this)
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "UPLOADS"); //? <- absolute path
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

//* Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

//* Serve uploaded files (use the same absolute folder)
app.use("/files", express.static(uploadDir));

//* Multer configuration (save to the same absolute folder)
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueName + path.extname(file.originalname)
    );
  },
});

const Uploads = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

//* UPLOAD ROUTE FOR SINGLE FILE
app.post("/upload", Uploads.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No Files Uploaded" });
    }
    const fileLink = {
      file: req.file.originalname,
      link: `http://localhost:3001/files/${req.file.filename}`,
      filename: req.file.filename
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
    res.status(500).json({error: error.message || 'Upload Failed'});
  }
});

//!Test Route
app.get('/file-info/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    const stats = fs.statSync(filePath);
    res.status(200).json({
      name: filename,
      size: stats.size,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch file info' });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
