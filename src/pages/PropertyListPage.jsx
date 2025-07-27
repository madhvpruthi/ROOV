import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PropertyListPage = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('https://roov.onrender.com/api/properties');
        if (Array.isArray(res.data)) {
          setProperties(res.data);
        } else {
          console.error('Unexpected response format:', res.data);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {properties.map((property) => (
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
  );
};

export default PropertyListPage;
