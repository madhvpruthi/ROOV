// import React, { useState, useEffect } from "react";

// const PropertyForm = ({ onSubmit, initialData }) => {
//   const [title, setTitle] = useState("");
//   const [location, setLocation] = useState("");
//   const [price, setPrice] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [preview, setPreview] = useState(null);

//   useEffect(() => {
//     if (initialData) {
//       setTitle(initialData.title);
//       setLocation(initialData.location);
//       setPrice(initialData.price);
//       setPreview(initialData.image);
//     }
//   }, [initialData]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setImageFile(file);
//     if (file) {
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!title || !location || !price || (!imageFile && !preview)) {
//       alert("Please fill all fields and select an image.");
//       return;
//     }

//     const newProperty = {
//       title,
//       location,
//       price,
//       image: imageFile ? URL.createObjectURL(imageFile) : preview,
//     };

//     onSubmit(newProperty);

//     // Clear form
//     setTitle("");
//     setLocation("");
//     setPrice("");
//     setImageFile(null);
//     setPreview(null);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
//       <input
//         type="text"
//         placeholder="Property Title"
//         className="w-full p-2 border"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Location"
//         className="w-full p-2 border"
//         value={location}
//         onChange={(e) => setLocation(e.target.value)}
//       />
//       <input
//         type="number"
//         placeholder="Price"
//         className="w-full p-2 border"
//         value={price}
//         onChange={(e) => setPrice(e.target.value)}
//       />
//       <input
//         type="file"
//         accept="image/*"
//         className="w-full p-2 border"
//         onChange={handleFileChange}
//       />
//       {preview && (
//         <img
//           src={preview}
//           alt="Preview"
//           className="w-48 h-32 object-cover rounded"
//         />
//       )}
//       <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
//         {initialData ? "Update Property" : "Add Property"}
//       </button>
//     </form>
//   );
// };

// export default PropertyForm;


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
