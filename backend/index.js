require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const Property = require("./models/Property"); // your schema
const app = express();
const PORT = process.env.PORT || 8000;

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// ✅ Serve static files
app.use("/uploads", express.static(uploadsDir));

// ✅ Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

// ✅ In-memory storage (can be replaced by DB)
let properties = [];
let contacts = [];
let nextPropertyId = 1;
let nextContactId = 1;

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("✔️ ROOV backend is running");
});

// ✅ Upload Images
app.post("/api/upload-images", upload.array("images"), (req, res) => {
  try {
    const imageUrls = req.files.map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    );
    res.status(200).json({ imageUrls });
  } catch (error) {
    console.error("Image upload failed:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
});

// ✅ Get All Properties
app.get("/api/properties", (req, res) => {
  res.json(properties);
});

// ✅ Create Property
app.post("/api/properties", (req, res) => {
  const { title, location, price, description, images } = req.body;

  if (!title || !location || price == null) {
    return res
      .status(400)
      .json({ error: "Missing required fields: title, location, price" });
  }

  const newProperty = {
    id: nextPropertyId++,
    title,
    location,
    price: Number(price),
    description: description || "",
    images: Array.isArray(images) ? images : [],
  };

  properties.push(newProperty);
  res.status(201).json(newProperty);
});

// ✅ Update Property
app.put("/api/properties/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = properties.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Property not found" });
  }

  properties[index] = { ...properties[index], ...req.body };
  res.json(properties[index]);
});

// ✅ Delete Property
app.delete("/api/properties/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = properties.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Property not found" });
  }

  properties.splice(index, 1);
  res.json({ message: "Deleted successfully" });
});

// ✅ Submit Contact Message
app.post("/api/contact", (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newContact = {
    id: nextContactId++,
    name,
    phone,
    message,
    createdAt: new Date().toISOString(),
  };

  contacts.push(newContact);
  res.status(201).json(newContact);
});

// ✅ Get All Contacts
app.get("/api/contacts", (req, res) => {
  res.json(contacts);
});

// ✅ Fallback route
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ ROOV backend running at http://localhost:${PORT}/`);
});
