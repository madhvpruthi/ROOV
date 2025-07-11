const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadImages } = require("../controllers/uploadController");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save in uploads folder
  },
  filename: (req, file, cb) => {
    // Use Date.now + original name to avoid conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.array("images", 10), uploadImages); // max 10 images at once

module.exports = router;
