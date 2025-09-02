// server.js (replace your file with this)
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const ImageKit = require("imagekit");
require("dotenv").config();

const app = express();
const baseUrl = process.env.BACKEND_URL || "https://jshare-server.onrender.com";
const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

//!FUCK THIS WE ARENT USING IT NO MORE!
//? Simple in-memory metadata store:
//? key = storedFilename (what multer saves), value = { originalName, size, type }
// const fileMetadata = {};

//* Middleware
app.use(cors({ origin: "https://jshare-hwdp.vercel.app/" }));
app.use(express.json());

//* Multer configuration (Store in memory)
const storage = multer.memoryStorage({});
const Uploads = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, //* 100MB limit bro
});

//! UPLOAD ROUTE FOR SINGLE FILE
app.post("/upload", Uploads.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No Files Uploaded" });
    }

    const sessionId = req.body.sessionId;
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID required" });
    }

    const result = await imageKit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/jshare_Uploads",
      tags: ["jshare", `session_${sessionId}`], // Add session ID tag
    });

    res.status(200).json({
      originalName: req.file.originalname,
      link: `${baseUrl}/download/${result.fileId}`,
      imageKitUrl: result.url,
      filename: result.fileId,
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
app.get("/file-info/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const file = await imageKit.getFileDetails(fileId);
    // console.log(file)
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    //TODO: FIX THE FILE TYPE: Just need to get the Filetype
    // Prefer real extension from name, then fall back to MIME suffix, then a sane label
    const ext =
      file.name && file.name.includes(".")
        ? file.name.split(".").pop().toLowerCase()
        : "";
    const mimeSuffix = file.mime ? file.mime.split("/").pop() : "";
    const type =
      ext || mimeSuffix || (file.fileType === "image" ? "image" : "file");

    res.status(200).json({
      name: file.name,
      imageKitUrl: file.url,
      storedFilename: file.fileId,
      size: file.size,
      type,
      //! type: file.fileType.split("/")[1] || "unknown", //! This dosent work bro cause
      // !Imagekit dosent returns e.g (image) instead of (image.jpg)
    });
  } catch (error) {
    console.error("file-info error:", error);
    res.status(500).json({ error: "Failed to fetch file info" });
  }
});

app.get("/recent-Uploads", async (req, res) => {
  //* Yo this is to get the recent-uploads info to display them.
  try {
    const sessionId = req.query.sessionId;
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID required" });
    }
    const files = await imageKit.listFiles({
      tags: ["jshare", `session_${sessionId}`],
      sort: "DESC_CREATED",
    });
    const shaped = files.map((f) => {
      const ext =
        f.name && f.name.includes(".")
          ? f.name.split(".").pop().toLowerCase()
          : "";
      const mimeSuffix = f.mime ? f.mime.split("/").pop() : "";
      const type =
        ext || mimeSuffix || (f.fileType === "image" ? "image" : "file");

      return {
        originalname: f.name,
        imageKitUrl: f.url,
        link: `${baseUrl}/download/${f.fileId}`,
        type,
        filename: f.fileId,
      };
    });
    res.status(200).json(shaped);
  } catch (error) {
    console.error("recent-Uploads error:", error);
    res.status(500).json({ error: "Failed to fetch recent uploads" });
  }
});
//! FILE DELETION
app.delete("/files/:fileId", async (req, res) => {
  try {
    const sessionId = req.query.sessionId;
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID required" });
    }

    const fileId = req.params.fileId;
    const file = await imageKit.getFileDetails(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (!file.tags || !file.tags.includes(`session_${sessionId}`)) {
      return res.status(403).json({ error: "Forbidden: You don’t own this file" });
    }

    await imageKit.deleteFile(fileId);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete File error:", error);
    res.status(500).json({ error: "Failed to delete File" });
  }
});
app.get("/download/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const file = await imageKit.getFileDetails(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Fetch file from ImageKit URL
    const response = await fetch(file.url);
    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
    res.setHeader("Content-Type", file.mime || "application/octet-stream");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Download failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

//* const PORT = 3001;
//* app.listen(PORT, () => {
//*  console.log(`Server is running on port ${PORT}`);
//*});
