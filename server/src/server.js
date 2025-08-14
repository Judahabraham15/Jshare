// server.js (replace your file with this)
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const fsp = fs.promises; //! ← Promise API for await

const uploadDir = path.join(__dirname, "UPLOADS"); //? <- absolute path
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

//? Simple in-memory metadata store:
//? key = storedFilename (what multer saves), value = { originalName, size, type }
const fileMetadata = {};

//* Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

//* Serve uploaded files (use the same absolute folder)
app.use("/files", express.static(uploadDir));

//* Multer configuration (save to the same absolute folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
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
  limits: { fileSize: 100 * 1024 * 1024 }, //* 100MB limit bro
});

//! UPLOAD ROUTE FOR SINGLE FILE
app.post("/upload", Uploads.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No Files Uploaded" });
    }

    //* Save original name & metadata in memory keyed by the stored filename
    fileMetadata[req.file.filename] = {
      originalName: req.file.originalname,
      size: req.file.size,
      type:
        path.extname(req.file.originalname).toLowerCase().replace(".", "") ||
        "unknown",
    };


    res.status(200).json({
      originalName: req.file.originalname,
      link: `http://localhost:3001/files/${req.file.filename}`,
      filename: req.file.filename,
    });
   
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

//!Test Route
app.get("/file-info/:filename", (req, res) => {
  try {
    const filenameParam = req.params.filename;
    const safeFilename = path.basename(filenameParam);
    const filePath = path.join(uploadDir, safeFilename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }
    const stats = fs.statSync(filePath);

    //* Simple way to get file type from extension

    const meta = fileMetadata[safeFilename];
    res.status(200).json({
      name: meta ? meta.originalName : safeFilename,
      storedFilename: safeFilename, //* This is to send the real filename saved
      size: stats.size,
      type: meta
        ? meta.type
        : path.extname(safeFilename).toLowerCase().replace(".", "") ||
          "unknown",
    });
  } catch (error) {
    console.error("file-info error:", error);
    res.status(500).json({ error: "Failed to fetch file info" });
  }
});

app.get("/recent-Uploads", (req, res) => {
  //* Yo this is to get the recent-uploads info to display them.
  try {
    const uploads = Object.entries(fileMetadata).map(([filename, meta]) => ({
      originalname: meta.originalName || filename, //*Just the real name of the file uploaded
      link: `http://localhost:3001/files/${filename}`,
      type: meta.type || "unknown",
      filename,
    }));
    res.status(200).json(uploads);
  } catch (error) {
    console.error("recent-Uploads error:", error);
    res.status(500).json({ error: "Failed to fetch recent uploads" });
  }
});
//! FILE DELETION
app.delete("/files/:filename", async (req, res) => {
      const filename = path.basename(req.params.filename);
      const filePath = path.join(uploadDir, filename);

 try {
    //* If metadata missing but file exists, still allow deletion.
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on disk" });
    }

    await fsp.unlink(filePath); //! ← Promise API

    //* Clean metadata if present
    if (fileMetadata[filename]) delete fileMetadata[filename];

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete File error:", error);
    res.status(500).json({ error: "Failed to delete File" });
  }
});
app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

