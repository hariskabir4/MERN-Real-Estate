// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import FilterComponent from "./FilterComponent";  // Filter component for category buttons or other filters
// import ResultsTab from "./ResultsTab";  // Display results status like "Showing X results"
// import ResultRow from "./ResultRow";  // Display individual property cards/rows
// import "./SearchPage.css";

// const SearchPage = () => {
//   const [results, setResults] = useState([]);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchResults = async () => {
//       const params = new URLSearchParams(location.search);
//       const query = params.get("query") || "";  // Search query from URL
//       const category = params.get("category") || "";  // Category (Sale/Rent) from URL

//       try {
//         const response = await fetch(`http://localhost:5000/api/properties/search?query=${query}&category=${category}`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await response.json();
//         setResults(data);  // Set the data received from backend
//       } catch (error) {
//         console.error("Error fetching search results:", error);
//       }
//     };

//     fetchResults();  // Call fetch function on page load or when the URL parameters change
//   }, [location]);  // Runs when the location (URL) changes

//   return (
//     <div className="search-page">
//       <FilterComponent />  {/* Filter options for Sale, Rent, etc. */}
//       <div className="results-section">
//         <ResultsTab />  {/* Tab for displaying total results */}
//         {results.length > 0 ? (
//           results.map((item, index) => (
//             <ResultRow
//               key={index}
//               image={item.imageUrl || "https://via.placeholder.com/100"}  // Display property image, fallback to placeholder
//               price={item.price}  // Price of the property
//               title={item.title}  // Property title
//               type={item.type || "N/A"}  // Property type (e.g., Residential, Commercial)
//               size={item.size || "N/A"}  // Size of the property
//               location={item.location || item.city || "Unknown"}  // Location of the property
//               date={item.date || "Unknown"}  // Listing date
//             />
//           ))
//         ) : (
//           <p>No results found</p>  // Show a message when no results match
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;









// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import FilterComponent from "./FilterComponent"; // For filtering options like Sale, Rent, etc.
// import ResultsTab from "./ResultsTab"; // To show results count
// import ResultRow from "./ResultRow"; // Displays property details
// import "./SearchPage.css";

// const SearchPage = () => {
//   const [results, setResults] = useState([]); // Store search results
//   const location = useLocation();

//   useEffect(() => {
//     const fetchResults = async () => {
//       const params = new URLSearchParams(location.search);
//       const query = params.get("query") || ""; // Search query from URL
//       const category = params.get("category") || ""; // Category (Sale/Rent) from URL

//       try {
//         const response = await fetch(`http://localhost:5000/api/properties/search?query=${query}&category=${category}`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await response.json();
//         console.log("Fetched Data:", data); // Debugging - Check API response
//         setResults(data); // Store fetched results
//       } catch (error) {
//         console.error("Error fetching search results:", error);
//       }
//     };

//     fetchResults(); // Fetch data on page load or URL change
//   }, [location]); // Runs when URL parameters change

//   return (
//     <div className="search-page">
//       <FilterComponent /> {/* Display filter options */}
//       <div className="results-section">
//         <ResultsTab total={results.length} /> {/* Show total number of results */}
//         {results.length > 0 ? (
//           results.map((item, index) => (
//             <ResultRow
//               key={index}
//               image={item.imageUrl || "https://via.placeholder.com/100"} // Display property image
//               purpose={item.purpose || "N/A"} // Purpose (For Sale, For Rent)
//               price={item.price ? `$${item.price}` : "Price not available"} // Format price
//               location={item.location || "Unknown"} // Location
//               city={item.city || "Unknown"} // City
//             />
//           ))
//         ) : (
//           <p>No results found</p> // Message if no results are available
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;









import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FilterComponent from "./FilterComponent";
import ResultsTab from "./ResultsTab";
import ResultRow from "./ResultRow";
import "./SearchPage.css";

const SearchPage = () => {
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
          setResults(data);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchResults();
  }, [location.search]);

  return (
    <div className="search-page">
      <FilterComponent />
      <div className="results-section">
        <ResultsTab total={results.length} />
        {results.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((property) => (
                <ResultRow key={property._id} property={property} />
              ))}
            </tbody>
          </table>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
