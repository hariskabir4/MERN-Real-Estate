import React, { useEffect, useState } from "react";
import "./ParentLayout.css";
import Filter from "./Filter";
import ResultCard from "./ResultCard";
import { useLocation, useNavigate } from "react-router-dom";

const ParentLayout = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      const params = new URLSearchParams(location.search);
      
      try {
        const url = `http://localhost:5000/api/properties/search?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
          console.error("Unexpected API response format:", data);
          setResults([]);
        } else {
          const formattedData = data.map(property => ({
            ...property,
            listedAt: property.listedAt 
              ? new Date(property.listedAt).toLocaleDateString("en-GB")
              : "N/A"
          }));
          setResults(formattedData);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      }
    };

    fetchResults();
  }, [location.search]);

  const handleCardClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="layout-container">
      {/* Filter Component */}
      <div className="filter-container-1">
        <Filter />
      </div>

      {/* ResultCard Component */}
      <div className="result-container">
        {results.length > 0 ? (
          results.map((result, index) => (
            <div 
              key={result._id || index} 
              onClick={() => handleCardClick(result._id)}
              style={{ cursor: 'pointer' }}
            >
              <ResultCard
                imageUrl={result.images?.[0] || "https://via.placeholder.com/150"}
                title={result.title}
                description={`Size: ${result.size} | Bedrooms: ${result.bedrooms || "N/A"} | Bathrooms: ${result.bathrooms || "N/A"}`}
                location={`${result.city}, ${result.state}`}
                price={`$${result.price}`}
                date={result.listedAt}
              />
            </div>
          ))
        ) : (
          <p>Loading properties...</p>
        )}
      </div>
    </div>
  );
};

export default ParentLayout;
