const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
//* Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

//* Serve uploaded files
app.use("/files", express.static("uploads"));

//* Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    //! The destination on where the files should go
    return callback(null, "uploads/");
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
  limits: { fileSize: 100 * 1024 * 1024 },
});
app.post("/upload", Uploads.single("files"), (res, req) => {});
app.listen(3001, () => {
  console.log("Server is running!");
});
console.log("Hello");
