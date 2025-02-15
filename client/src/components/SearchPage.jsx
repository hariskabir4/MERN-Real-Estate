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
import axios from "axios";
import FilterComponent from "./FilterComponent";
import ResultsTab from "./ResultsTab";
import ResultRow from "./ResultRow";
import "./SearchPage.css";

const SearchPage = () => {
  const [properties, setProperties] = useState([]); // State to store fetched properties

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/properties"); // Adjust the URL if needed
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []); // Runs once on component mount

  return (
    <div className="search-page">
      <FilterComponent />
      <div className="results-section">
        <ResultsTab />
        {properties.length > 0 ? (
          properties.map((property, index) => (
            <ResultRow
              key={index}
              image={property.images?.[0]} // Assuming images is an array
              price={`$${property.price}`}
              title={property.title}
              type={property.purpose}
              size={`${property.size} m²`}
              location={`${property.location}, ${property.city}`}
              date={property.listedAt}
            />
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
