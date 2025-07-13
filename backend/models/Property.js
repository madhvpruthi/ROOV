const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  images: [String], // Array of image URLs
});

module.exports = mongoose.model("Property", PropertySchema);
