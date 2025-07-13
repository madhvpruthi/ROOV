require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const Property = require("./models/Property");
const Contact = require("./models/Contact"); // ✅ NEW
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

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

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
app.get("/api/properties", async (req, res) => {
  try {
    const props = await Property.find();
    res.json(props);
  } catch (err) {
    res.status(500).json({ error: "Error fetching properties" });
  }
});

// ✅ Create Property
app.post("/api/properties", async (req, res) => {
  try {
    const { title, location, price, description, images } = req.body;

    if (!title || !location || price == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newProperty = new Property({
      title,
      location,
      price,
      description: description || "",
      images: Array.isArray(images) ? images : [],
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(500).json({ error: "Failed to create property" });
  }
});

// ✅ Update Property
app.put("/api/properties/:id", async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Property not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update property" });
  }
});

// ✅ Delete Property
app.delete("/api/properties/:id", async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Property not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete property" });
  }
});

// ✅ Submit Contact Message (MongoDB)
app.post("/api/contact", async (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newContact = new Contact({ name, phone, message });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (err) {
    console.error("❌ Contact save error:", err);
    res.status(500).json({ error: "Failed to submit message" });
  }
});

// ✅ Get All Contacts
app.get("/api/contacts", async (req, res) => {
  try {
    const allContacts = await Contact.find();
    res.json(allContacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// ✅ Fallback Route
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ ROOV backend running at http://localhost:${PORT}/`);
});
