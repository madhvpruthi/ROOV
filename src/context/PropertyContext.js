import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);

  const baseURL = "https://roov.onrender.com"; // 👈 Use this base URL directly

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/properties`);
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to load properties:", err);
      toast.error("Could not load properties");
    }
  };

  const addProperty = async (prop) => {
    try {
      const res = await axios.post(`${baseURL}/api/properties`, prop);
      setProperties(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Add failed:", err);
      toast.error("Failed to add property");
    }
  };

  const updateProperty = async (updated) => {
    try {
      const res = await axios.put(`${baseURL}/api/properties/${updated._id || updated.id}`, updated);
      setProperties(prev =>
        prev.map(p => (p._id === updated._id || p.id === updated.id ? res.data : p))
      );
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update property");
    }
  };

  const deleteProperty = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/properties/${id}`);
      setProperties(prev => prev.filter(p => (p._id || p.id) !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete property");
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        fetchProperties,
        addProperty,
        updateProperty,
        deleteProperty
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => useContext(PropertyContext);
