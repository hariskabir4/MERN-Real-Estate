import React from "react";
import FilterComponent from "./FilterComponent";
import ResultsTab from "./ResultsTab";
import ResultRow from "./ResultRow";
import "./SearchPage.css";

const SearchPage = () => {
  const dummyData = [
    {
      image: "https://via.placeholder.com/100",
      price: "1,000 $",
      title: "140 Square Meters Shop for Rent",
      type: "Shop For Rent",
      size: "140 m²",
      location: "Yenimahalle, Ankara",
      date: "09.02.2024",
    },
    // Add more items here
  ];

  return (
    <div className="search-page">
      <FilterComponent />
      <div className="results-section">
        <ResultsTab />
        {dummyData.map((item, index) => (
          <ResultRow key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
