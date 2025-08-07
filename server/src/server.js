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


// TODO: THERE ARE BUGS TO FIX!!!😭

//* Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    //! The destination on where the files should go(i.e the folder it should go to.)
    return callback(null, "UPLOADS/");
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

//* UPLOAD ROUTE
app.post("/upload", Uploads.single("file"), (res, req) => {
  console.log(req.body);
  console.log(req.file);
});
// const PORT = 3001
app.listen(3001, () => {
  console.log("Server is running!");
});
console.log("Hello");
