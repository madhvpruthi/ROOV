// backend/index.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8000;

// ✅ Enable CORS on all routes
app.use(cors());

// ✅ Parse JSON and URL‑encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// ✅ Serve uploaded images
app.use("/uploads", express.static(uploadsDir));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

// In-memory data (can be replaced with DB)
let properties = [];
let contacts = [];
let nextPropertyId = 1;
let nextContactId = 1;

// ✅ Health check endpoint
app.get("/", (req, res) => {
  res.send("✔️ Backend is up and running!");
});

// ✅ Upload images endpoint
app.post("/api/upload-images", upload.array("images"), (req, res) => {
  try {
    const imageUrls = req.files.map(
      (f) => `http://localhost:${PORT}/uploads/${f.filename}`
    );
    res.status(200).json({ imageUrls });
  } catch (err) {
    console.error("Image upload failed:", err);
    res.status(500).json({ error: "Failed to upload images" });
  }
});

// ✅ CRUD Property API

app.get("/api/properties", (req, res) => {
  res.json(properties);
});

app.post("/api/properties", (req, res) => {
  const { title, location, price, description, images } = req.body;
  if (!title || !location || price == null) {
    return res
      .status(400)
      .json({ error: "Missing required fields: title, location, price" });
  }
  const newProp = {
    id: nextPropertyId++,
    title,
    location,
    price: Number(price),
    description: description || "",
    images: Array.isArray(images) ? images : [],
  };
  properties.push(newProp);
  res.status(201).json(newProp);
});

app.put("/api/properties/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = properties.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Property not found" });
  }
  properties[idx] = { ...properties[idx], ...req.body };
  res.json(properties[idx]);
});

app.delete("/api/properties/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = properties.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Property not found" });
  }
  properties.splice(idx, 1);
  res.json({ message: "Deleted successfully" });
});

// ✅ Contact form endpoints

// backend/index.js (Contact part)
app.post("/api/contact", (req, res) => {
  const { name, phone, message } = req.body;
  if (!name || !phone || !message)
    return res.status(400).json({ error: "All fields are required" });

  const newContact = {
    id: nextContactId++,
    name,
    phone,
    message,
    createdAt: new Date().toISOString(),
  };
  contacts.push(newContact);
  return res.status(201).json(newContact);
});


app.get("/api/contacts", (req, res) => {
  res.json(contacts);
});

// ✅ Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ✅ Start server
app.listen(PORT, () =>
  console.log(`✅ Backend running at http://localhost:${PORT}/`)
);
