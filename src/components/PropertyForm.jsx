import React, { useState, useEffect } from "react";

const PropertyForm = ({ initialData = {}, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price || "");
      setLocation(initialData.location || "");
      setImages(initialData.images || []);
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setImages(fileURLs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      price,
      location,
      images,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPrice("");
    setLocation("");
    setImages([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full border p-2"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full border p-2"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        className="w-full border p-2"
        required
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        className="w-full border p-2"
        required
      />
      <input
        type="file"
        onChange={handleImageChange}
        multiple
        className="w-full border p-2"
      />
      <div className="flex flex-wrap gap-2">
        {images.map((src, idx) => (
          <img key={idx} src={src} alt="preview" className="h-20 w-20 object-cover rounded" />
        ))}
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {initialData && initialData.id ? "Update" : "Add"} Property
      </button>
    </form>
  );
};

export default PropertyForm;