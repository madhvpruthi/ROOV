import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';

const PropertyListPage = () => {
  const { properties } = useProperty();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const filteredProperties = properties
    .filter((property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'lowToHigh') return a.price - b.price;
      if (sortOrder === 'highToLow') return b.price - a.price;
      return 0;
    });

  return (
    <div className="p-6">
      {/* 🔍 Search and Filter */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4">
        <input
          type="text"
          placeholder="Search by title or location..."
          className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full sm:w-1/4 p-2 border border-gray-300 rounded-md"
        >
          <option value="">Sort by Price</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
      </div>

      {/* 🏘️ Property Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
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
                <strong>Price:</strong> ₹{property.price}
              </p>
              <p className="text-gray-600 text-sm line-clamp-2">
                {property.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PropertyListPage;