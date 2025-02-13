import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ParentLayout from "./ParentLayout";

const SearchProperty = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("query") || "";
    const category = queryParams.get("category") || "";

    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                let params = {};

                // If category is 'Sale' or 'Rent', use 'purpose' field
                if (category === "Sale" || category === "Rent") {
                    params.purpose = category;
                } 
                // If category is 'House', 'Land', or 'Workplace', search in 'title'
                else if (["House", "Land", "Workplace"].includes(category)) {
                    params.title = category;
                }

                // Add search term if available
                if (searchTerm) {
                    params.query = searchTerm;
                }

                const response = await axios.get("http://localhost:5000/api/properties/search", { params });
                setResults(response.data);
            } catch (error) {
                console.error("Search failed:", error);
            }
        };

        fetchProperties();
    }, [searchTerm, category]);

    return (
        <div>
            <h2>Search Results</h2>
            <ParentLayout results={results} />
        </div>
    );
};

export default SearchProperty;
