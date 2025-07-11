import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);

  /* ─────────────  helpers  ───────────── */

  const fetchProperties = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/properties");
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to load properties:", err);
      toast.error("Could not load properties");
    }
  };

  const addProperty = prop => setProperties(prev => [...prev, prop]);

  const updateProperty = updated =>
    setProperties(prev => prev.map(p => (p.id === updated.id ? updated : p)));

  const deleteProperty = async id => {
    try {
      await axios.delete(`http://localhost:8000/api/properties/${id}`);
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success("Property deleted ✔︎");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(
        err?.response?.data?.message || "Server error while deleting"
      );
    }
  };

  /* ───────────  load once  ─────────── */

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
