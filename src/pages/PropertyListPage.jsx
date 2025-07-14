import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function PropertyListPage() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://roov.onrender.com";

  useEffect(() => {
    axios.get(`${BASE_URL}/api/properties`)
      .then(res => setProperties(res.data))
      .catch(err => {
        console.error("Failed to fetch properties:", err);
        alert("Could not load properties.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesLocation = locationFilter
      ? property.location.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-700">
        Loading properties...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-inter text-slate-900">
      <h1 className="text-4xl font-bold mb-10 text-center text-rose-600 drop-shadow-sm">
        Explore Your Next Home
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-10 justify-center">
        <input
          type="text"
          placeholder="Search by title..."
          className="border border-rose-200 bg-rose-50 placeholder-rose-400 text-slate-800 rounded-xl p-3 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-rose-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by location..."
          className="border border-rose-200 bg-rose-50 placeholder-rose-400 text-slate-800 rounded-xl p-3 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-rose-400"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {filteredProperties.length === 0 ? (
          <p className="text-slate-600 col-span-full text-center">No properties match your criteria.</p>
        ) : (
          filteredProperties.map((property) => (
            <Link
              key={property._id || property.id}
              to={`/properties/${property._id || property.id}`}
              className="bg-white rounded-3xl shadow hover:shadow-xl hover:-translate-y-1 transition overflow-hidden border border-rose-100"
            >
              <img
                src={property.images?.[0] || "https://via.placeholder.com/400"}
                alt={property.title}
                className="w-full h-52 object-cover rounded-t-3xl"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-slate-800 mb-1">
                  {property.title}
                </h2>
                <p className="text-slate-600 text-sm mb-1">
                  Location: {property.location}
                </p>
                <p className="text-rose-600 font-bold mt-2 text-lg">
                  ₹ {property.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
