import React, { useEffect, useState } from "react";
import "./ParentLayout.css";
import Filter from "./Filter";
import ResultCard from "./ResultCard";
import { useLocation } from "react-router-dom";

const ParentLayout = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchResults = async () => {
      const params = new URLSearchParams(location.search);
      const query = params.get("query") || null;
      const category = params.get("category") || null;

      console.log("Fetching results for:", { query, category });

      try {
        let searchParams = new URLSearchParams();
        if (query) searchParams.append("query", query);
        if (category) searchParams.append("category", category);

        const url = `http://localhost:5000/api/properties/search?${searchParams.toString()}`;
        console.log("Final API URL:", url);

        const response = await fetch(url);
        console.log("API Response Status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Final results stored in state:", data);

        if (!Array.isArray(data)) {
          console.error("Unexpected API response format:", data);
          setResults([]);
        } else {
          const formattedData = data.map(property => ({
            ...property,
            listedAt: property.listedAt 
              ? new Date(property.listedAt).toLocaleDateString("en-GB") // Formats as DD/MM/YYYY
              : "N/A"
          }));
          
          setResults(formattedData);
          // setResults(data);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchResults();
  }, [location.search]);

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
            <ResultCard
              key={index}
              imageUrl={result.images?.[0] || "https://via.placeholder.com/150"}
              title={result.title}
              description={`Size: ${result.size} | Bedrooms: ${result.bedrooms || "N/A"} | Bathrooms: ${result.bathrooms || "N/A"}`}
              location={`${result.city}, ${result.state}`}
              price={`$${result.price}`}
              // date={new Date(result.listedAt).toLocaleDateString()}
              date={new Date(result.listedAt).toLocaleDateString("en-GB")}
            />
          ))
        ) : (
          <p>Loading properties...</p>
        )}
      </div>
    </div>
  );
};

export default ParentLayout;
