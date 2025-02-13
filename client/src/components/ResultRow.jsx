// // import React from "react";
// // import "./ResultRow.css"; // Ensure your CSS file is correctly linked

// // const ResultRow = ({ image, purpose, price, location, city }) => {
// //   return (
// //     <div className="result-row">
// //       <img src={image} alt="Property" className="property-image" />
// //       <div className="property-details">
// //         <h3>{purpose || "N/A"}</h3> {/* Display purpose (e.g., For Sale, For Rent) */}
// //         <p className="property-price">{price ? `$${price}` : "Price not available"}</p>
// //         <p className="property-location">
// //           {location ? location : "Unknown"}, {city ? city : "Unknown"}
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ResultRow;








// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./ResultRow.css"; 

// const ResultRow = ({ image, purpose, price, location, city, details }) => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate("/property-detail", {
//       state: {
//         image,
//         purpose,
//         price,
//         location,
//         city,
//         details
//       }
//     });
//   };

//   return (
//     <div className="result-row" onClick={handleClick}>
//       <img src={image} alt="Property" className="property-image" />
//       <div className="property-details">
//         <h3>{purpose || "N/A"}</h3>
//         <p className="property-price">{price ? `$${price}` : "Price not available"}</p>
//         <p className="property-location">
//           {location ? location : "Unknown"}, {city ? city : "Unknown"}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ResultRow;


import { Link } from 'react-router-dom';

const ResultRow = ({ property }) => {
  if (!property) return null; // Handle undefined/null property

  return (
    <tr key={property._id}>
      <td>{property.title || "N/A"}</td>
      <td>{property.price || "N/A"}</td>
      <td>{property.location || "N/A"}</td>
      <td>
        <Link to={`/property/${property._id}`} style={{ textDecoration: 'none' }}>
          <button style={{ color: 'blue' }}>View Details</button>
        </Link>
      </td>
    </tr>
  );
};

export default ResultRow;
