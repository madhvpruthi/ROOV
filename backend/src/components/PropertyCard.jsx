// import React from "react";

// const PropertyCard = ({ property, onDelete, onEdit, isAdmin }) => {
//   return (
//     <div className="border rounded p-4 shadow bg-white">
//       <img
//         src={property.image}
//         alt={property.title}
//         className="w-full h-48 object-cover rounded mb-4"
//       />
//       <h3 className="text-xl font-semibold">{property.title}</h3>
//       <p className="text-gray-600">{property.location}</p>
//       <p className="text-green-700 font-bold mb-2">₹{property.price}</p>

//       {isAdmin && (
//         <div className="flex gap-2 mt-2">
//           <button
//             onClick={() => onEdit(property)}
//             className="bg-blue-500 text-white px-3 py-1 rounded"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => onDelete(property.id)}
//             className="bg-red-500 text-white px-3 py-1 rounded"
//           >
//             Delete
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PropertyCard;






// src/components/PropertyCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const PropertyCard = ({ property, onDelete, onEdit, isAdmin }) => {
  return (
    <div className="border p-4 rounded shadow bg-white">
      <Link to={`/property/${property.id}`}>
        {property.images?.[0] && (
          <img
            src={property.images[0]}
            alt="Property"
            className="h-40 w-full object-cover rounded mb-2"
          />
        )}
        <h3 className="text-lg font-semibold">{property.title}</h3>
        <p className="text-gray-600">{property.location}</p>
        <p className="text-green-700 font-bold">₹{property.price}</p>
      </Link>

      {isAdmin && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => onEdit(property)} className="text-blue-500">Edit</button>
          <button onClick={() => onDelete(property.id)} className="text-red-500">Delete</button>
        </div>
      )}
    </div>
  );
};

export default PropertyCard;
