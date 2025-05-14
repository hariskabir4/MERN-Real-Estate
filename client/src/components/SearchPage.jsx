// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import FilterComponent from "./FilterComponent";
// import ResultsTab from "./ResultsTab";
// import ResultRow from "./ResultRow";
// import "./SearchPage.css";

// const SearchPage = () => {
//   const [properties, setProperties] = useState([]); // State to store fetched properties
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/properties");
//         console.log("Fetched properties:", response.data); // Debugging log
//         setProperties(response.data);
//       } catch (error) {
//         console.error("Error fetching properties:", error);
//       }
//     };

//     fetchProperties();
//   }, []);

//   const baseUrl = "http://localhost:5000"; // Adjust if needed

//   return (
//     <div className="search-page">
//       <FilterComponent />
//       <div className="results-section">
//         <ResultsTab />
//         {properties.length > 0 ? (
//           properties.map((property, index) => (
//             <ResultRow
//               key={index}
//               image={
//                 property.images?.[0]
//                   ? `http://localhost:5000/uploads/${property.images[0]}`
//                   : "https://placehold.jp/150x150.png"
//               }
//               price={`$${property.price}`}
//               title={property.title}
//               type={property.purpose}
//               size={`${property.size} m²`}
//               location={`${property.location}, ${property.city}`}
//               date={new Date(property.listedAt).toLocaleDateString()}
//             />
//           ))
//         ) : (
//           <p>No results found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import FilterComponent from "./FilterComponent";
import ResultsTab from "./ResultsTab";
import ResultRow from "./ResultRow";
import "./SearchPage.css";

const SearchPage = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/properties/search?category=Sell");
        console.log("Fetched properties:", response.data);
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const baseUrl = "http://localhost:5000/uploads"; // Define uploads path

  return (
    <div className="search-page">
      <FilterComponent />
      <div className="results-section">
        <ResultsTab />

        {properties.length > 0 ? (
          properties.map((property, index) => {
            console.log("Component Rendered - Properties Length:", properties.length);
            console.log("Property Data:", property);
            console.log(` Property ID ${property.id || index} - Images:`, property.images);
            const imageFile = property.images?.[0]; // Take first image from array

            const imageUrl =
              imageFile && !imageFile.startsWith("http")
                ? `${baseUrl}/${imageFile}`
                : imageFile || "https://placehold.jp/150x150.png"; // Default placeholder

                console.log("Property Image URL:", property.imageURL);
            return (
              <ResultRow
                key={property.id || index}
                image={imageUrl} // Pass corrected URL
                price={`$${property.price}`}
                title={property.title}
                type={property.purpose}
                size={`${property.size} m²`}
                location={`${property.location}, ${property.city}`}
                date={new Date(property.listedAt).toLocaleDateString()}
              />
            );
          })
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
