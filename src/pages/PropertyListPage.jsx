import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';

const PropertyListPage = () => {
  const { properties } = useProperty();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Filtered & Sorted Properties
  const filtered = properties
    .filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase());

      const price = parseFloat(property.price.toString().replace(/[^0-9.]/g, '')) || 0;
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;

      return matchesSearch && price >= min && price <= max;
    })
    .sort((a, b) => {
      const priceA = parseFloat(a.price.toString().replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat(b.price.toString().replace(/[^0-9.]/g, '')) || 0;

      if (sortOrder === 'lowToHigh') return priceA - priceB;
      if (sortOrder === 'highToLow') return priceB - priceA;
      return 0;
    });

  return (
    <div className="p-6">
      {/* 🔍 Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or location"
          className="border rounded-xl px-3 py-2 col-span-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min Price"
          className="border rounded-xl px-3 py-2"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          className="border rounded-xl px-3 py-2"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select
          className="border rounded-xl px-3 py-2"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/* 🏠 Property Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((property) => (
          <Link
            key={property._id}
            to={`/properties/${property._id}`}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            {property.images && property.images[0] && (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {property.title}
              </h2>
              <p className="text-gray-600 text-sm mb-1">
                <strong>Location:</strong> {property.location}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <strong>Price:</strong> {property.price}
              </p>
              <p className="text-gray-600 text-sm line-clamp-2">
                {property.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No properties match your filters.</p>
      )}
    </div>
  );
};

export default PropertyListPage;
