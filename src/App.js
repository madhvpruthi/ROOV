import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PropertyListPage from "./pages/PropertyListPage";
import { PropertyProvider } from "./context/PropertyContext";
import PropertyDetails from "./pages/PropertyDetailPage";
import AdminPanel from "./pages/AdminPanel";
import ContactPage from "./pages/ContactPage";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <PropertyProvider>
      <Router>
        <div className="bg-gray-100 min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertyListPage />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
      </Router>
    </PropertyProvider>
  );
}
