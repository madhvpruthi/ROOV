require("dotenv").config();
console.log("✅ Loaded ADMIN_CODE:", process.env.ADMIN_CODE);
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const Property = require("./models/Property");
const Contact = require("./models/Contact");

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

// ✅ verify-admin route
app.post("/api/verify-admin", (req, res) => {
  const { code } = req.body;
  const ADMIN_CODE = process.env.ADMIN_CODE;

  if (!code) return res.status(400).json({ error: "No code provided" });

  if (code === ADMIN_CODE) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ error: "Invalid code" });
  }
});

// ✅ Upload Images (HTTPS fix)
app.post("/api/upload-images", upload.array("images"), (req, res) => {
  try {
    const baseUrl = "https://roov.onrender.com";
    const imageUrls = req.files.map(
      (file) => `${baseUrl}/uploads/${file.filename}`
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
    console.error("Failed to fetch properties:", err);
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

    const fixedImages = (Array.isArray(images) ? images : []).map((url) =>
      url.replace("http://", "https://")
    );

    const newProperty = new Property({
      title,
      location,
      price,
      description: description || "",
      images: fixedImages,
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

// ✅ Submit Contact Message
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

// ✅ OPTIONAL: Cleanup Route for Image URLs (run once)
app.patch("/api/fix-image-links", async (req, res) => {
  try {
    const properties = await Property.find();
    let updatedCount = 0;

    for (const prop of properties) {
      const updatedImages = prop.images.map((img) =>
        img.startsWith("http://") ? img.replace("http://", "https://") : img
      );

      if (JSON.stringify(updatedImages) !== JSON.stringify(prop.images)) {
        prop.images = updatedImages;
        await prop.save();
        updatedCount++;
      }
    }

    res.json({ message: `✅ Updated ${updatedCount} properties.` });
  } catch (err) {
    res.status(500).json({ error: "Failed to fix image links" });
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
