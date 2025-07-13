exports.uploadImages = (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
  
    // Create array of image URLs for frontend to use
    const imageUrls = req.files.map((file) => {
      return `http://localhost:5000/uploads/${file.filename}`;
    });
  
    res.json({ imageUrls });
  };
  