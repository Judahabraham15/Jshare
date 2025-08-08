const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");


const uploadDir = "UPLOADS";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const app = express();
//* Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

//* Serve uploaded files
app.use("/files", express.static(path.join(__dirname, "UPLOADS")));

// TODO: THERE ARE BUGS TO FIX!!!😭

//* Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    //! The destination on where the files should go(i.e the folder it should go to.)
     callback(null, `./UPLOADS`);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9); //? Helped by Ai for this process
    cb(
      null,
      file.fieldname + "-" + uniqueName + path.extname(file.originalname)
    ); //! This just gives it a uniqueName
  },
});
const Uploads = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, //? 100MB limit bro
});

//* UPLOAD ROUTE FOR SINGLE FILE
app.post("/upload", Uploads.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No Files Uploaded" });
    }
    const fileLink = {
      file: req.file.originalname,
      link: `http://localhost:5174/files/${req.file.filename}`,
    };
    res.status(200).json(fileLink)
  } catch (error) {
    console.error("Upload error:", error);
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "File too large" });
      }
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({error: error.message || 'Upload Failed'})
  }
});

//!Test Route
app.get('/' , (req, res)=>{
  res.send('Server is running')
})
const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server is running!");
});
console.log("Hello");
