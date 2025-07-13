const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "../data/properties.json");

// Helper to read properties file
function readProperties() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]", "utf8");
  }
  const data = fs.readFileSync(dataFile);
  return JSON.parse(data);
}

// Helper to save properties file
function saveProperties(properties) {
  fs.writeFileSync(dataFile, JSON.stringify(properties, null, 2));
}

exports.getProperties = (req, res) => {
  const properties = readProperties();
  res.json(properties);
};

exports.addProperty = (req, res) => {
  const properties = readProperties();
  const newProperty = req.body;

  if (!newProperty.title || !newProperty.location || !newProperty.price || !newProperty.images) {
    return res.status(400).json({ error: "Missing required property fields" });
  }

  properties.push(newProperty);
  saveProperties(properties);
  res.status(201).json(newProperty);
};

exports.updateProperty = (req, res) => {
  const properties = readProperties();
  const id = req.params.id;
  const index = properties.findIndex((p) => p.id == id);

  if (index === -1) {
    return res.status(404).json({ error: "Property not found" });
  }

  properties[index] = { ...properties[index], ...req.body };
  saveProperties(properties);
  res.json(properties[index]);
};

exports.deleteProperty = (req, res) => {
  let properties = readProperties();
  const id = req.params.id;
  const index = properties.findIndex((p) => p.id == id);

  if (index === -1) {
    return res.status(404).json({ error: "Property not found" });
  }

  properties.splice(index, 1);
  saveProperties(properties);
  res.json({ message: "Property deleted" });
};
