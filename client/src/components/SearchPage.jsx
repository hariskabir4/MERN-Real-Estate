// import React from "react";
// import FilterComponent from "./FilterComponent";
// import ResultsTab from "./ResultsTab";
// import ResultRow from "./ResultRow";
// import "./SearchPage.css";

// const SearchPage = () => {
//   const dummyData = [
//     {
//       image: "https://via.placeholder.com/100",
//       price: "1,000 $",
//       title: "140 Square Meters Shop for Rent",
//       type: "Shop For Rent",
//       size: "140 m²",
//       location: "Yenimahalle, Ankara",
//       date: "09.02.2024",
//     },
//     // Add more items here
//   ];

//   return (
//     <div className="search-page">
//       <FilterComponent />
//       <div className="results-section">
//         <ResultsTab />
//         {dummyData.map((item, index) => (
//           <ResultRow key={index} {...item} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;

import React, { useState, useEffect } from "react";
import FilterComponent from "./FilterComponent";
import ResultsTab from "./ResultsTab";
import ResultRow from "./ResultRow";
import "./SearchPage.css";

const SearchPage = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/properties"); // Ensure this URL is correct
        const data = await response.json();
        console.log("Fetched Properties:", data); // Debugging: Log received data
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);


  return (
    <div className="search-page">
      <FilterComponent />
      <div className="results-section">
        <ResultsTab />
        {properties.map((property, index) => (
          <ResultRow
            key={index}
            image={property.images?.[0] || "https://via.placeholder.com/100"} // First image or fallback
            price={`$${property.price}`}
            title={property.title}
            type={property.purpose}
            size={`${property.size} m²`}
            location={`${property.location}, ${property.city}`}
            date={new Date(property.listedAt).toLocaleDateString()}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
