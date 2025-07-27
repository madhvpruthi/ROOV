// ✅ UPDATED AdminPanel.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";
import { useProperty } from "../context/PropertyContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "https://roov.onrender.com";

export default function AdminPanel() {
  const [code, setCode] = useState("");
  const [auth, setAuth] = useState(false);
  const [mode, setMode] = useState("properties");

  const { properties, addProperty, updateProperty, deleteProperty } = useProperty();
  const [contacts, setContacts] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/verify-admin`, { code });
      if (res.data.success) setAuth(true);
    } catch (err) {
      alert("Incorrect code");
      console.error("Verification error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!auth) return;
    axios.get(`${BASE_URL}/api/contacts`)
      .then(res => setContacts(res.data))
      .catch(console.error);
  }, [auth]);

  const resetForm = () => {
    setTitle("");
    setLocation("");
    setPrice("");
    setDescription("");
    setImages([]);
    setEditingProperty(null);
  };

  const handleImageChange = e => setImages([...e.target.files]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title || !location || !price || !description)
      return alert("Please fill all fields");

    setLoading(true);
    let imageUrls = editingProperty?.images || [];

    if (images.length > 0) {
      try {
        const fm = new FormData();
        images.forEach(img => fm.append("images", img));
        const uploadRes = await axios.post(`${BASE_URL}/api/upload-images`, fm);
        imageUrls = [...imageUrls, ...uploadRes.data.imageUrls];
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Image upload failed");
        setLoading(false);
        return;
      }
    }

    const propData = {
      title,
      location,
      price,
      description,
      images: imageUrls
    };

    try {
      if (editingProperty) {
        await axios.put(`${BASE_URL}/api/properties/${editingProperty._id || editingProperty.id}`, propData);
        updateProperty({ ...editingProperty, ...propData });
      } else {
        const res = await axios.post(`${BASE_URL}/api/properties`, propData);
        addProperty(res.data);
      }
      resetForm();
    } catch (err) {
      console.error("Save failed:", err?.response?.data || err.message);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = p => {
    setEditingProperty(p);
    setTitle(p.title);
    setLocation(p.location);
    setPrice(p.price);
    setDescription(p.description);
    setImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = p => {
    if (window.confirm("Delete?")) deleteProperty(p._id || p.id);
  };

  if (!auth) {
    return (
      <div className="p-8 mx-auto max-w-md bg-white rounded shadow mt-20">
        <h2 className="text-xl mb-4">Admin Login</h2>
        <form onSubmit={handleAuth}>
          <input
            type="password"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Enter admin code"
            className="border w-full p-2 mb-4"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold">Admin Panel</h2>

      <div className="flex gap-4 mb-6">
        {[
          ["properties", "Manage Properties"],
          ["contacts", "View Contacts"]
        ].map(([key, label]) => (
          <button
            key={key}
            className={`px-4 py-2 rounded ${mode === key ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "properties" && (
        <>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
            {[
              ["Title", title, setTitle],
              ["Location", location, setLocation],
              ["Price (e.g. 50 lakhs)", price, setPrice],
              ["Description", description, setDescription]
            ].map(([ph, val, setter], i) => (
              <input
                key={i}
                type="text"
                placeholder={ph}
                value={val}
                onChange={e => setter(e.target.value)}
                className="border rounded p-2 w-full"
              />
            ))}
            <input type="file" multiple onChange={handleImageChange} className="border rounded p-2 w-full" />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : editingProperty ? "Update" : "Add"} Property
            </button>
            {editingProperty && (
              <button
                type="button"
                onClick={resetForm}
                className="ml-4 bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...new Map(properties.map(p => [p._id, p])).values()].map(p => (
              <PropertyCard
                key={p._id}
                property={p}
                isAdmin
                onEdit={() => handleEdit(p)}
                onDelete={() => handleDelete(p)}
              />
            ))}
          </div>
        </>
      )}

      {mode === "contacts" && (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Contact Messages</h3>
          <table className="min-w-full rounded overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                {["Name", "Phone", "Message", "Date"].map(h => (
                  <th key={h} className="p-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map(c => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.message}</td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
