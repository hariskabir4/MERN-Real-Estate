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

  const baseUrl = "http://localhost:5000"; // Adjust if needed

  return (
    <div className="search-page">
      <FilterComponent />
      <div className="results-section">
        <ResultsTab />
        {properties.length > 0 ? (
          properties.map((property, index) => (
            // <ResultRow
            //   key={index}
            //   image={property.images?.[0]}
            //   price={`$${property.price}`}
            //   title={property.title}
            //   type={property.purpose}
            //   size={`${property.size} m²`}
            //   location={`${property.location}, ${property.city}`}
            //   date={property.listedAt}
            // />

            <ResultRow
              key={index}
              image={property.images?.[0] ? `${baseUrl}/uploads/${property.images[0]}` : "https://via.placeholder.com/150"}
              price={`$${property.price}`}
              title={property.title}
              type={property.purpose}
              size={`${property.size} m²`}
              location={`${property.location}, ${property.city}`}
              date={new Date(property.listedAt).toLocaleDateString()}
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
