import React from "react";
import "./ResultsTab.css";

const ResultsTab = () => {
  return (
    <div className="results-tab">
      <input
        type="text"
        placeholder="Search for a location or listing title..."
        className="search-input"
      />
      <select className="sort-dropdown">
        <option value="newest">Newest</option>
        <option value="priceLowHigh">Price: Low to High</option>
        <option value="priceHighLow">Price: High to Low</option>
      </select>
    </div>
  );
};

export default ResultsTab;
