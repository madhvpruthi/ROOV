import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://roov.onrender.com";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/properties/${id}`)
      .then(res => {
        setProperty(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Property fetch error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-700">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-6">
        <p className="text-slate-700">Property not found.</p>
        <button onClick={() => navigate(-1)} className="text-indigo-500 underline mt-4">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto font-inter">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-600 leading-tight">
          {property.title}
        </h1>
        <div className="text-lg space-y-2 mb-6 text-slate-700">
          <p><strong className="text-slate-900">Location:</strong> {property.location}</p>
          <p><strong className="text-slate-900">Price:</strong> ₹ {property.price?.toLocaleString()}</p>
        </div>
        <p className="text-slate-600 mb-6 leading-relaxed whitespace-pre-wrap border-t pt-4">
          {property.description}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {property.images?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${property.title}-${index}`}
              className="rounded-xl cursor-pointer hover:scale-105 transition-transform duration-200 shadow"
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Zoomed"
            className="max-w-[90vw] max-h-[90vh] rounded-2xl border-4 border-white shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
