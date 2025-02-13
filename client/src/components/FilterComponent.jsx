import React from "react";
//import "./FilterComponent.css"; // Optional: Create a CSS file for styling

const FilterComponent = () => {
  return (
    <div className="filter-container">
      <h3>Filter Properties</h3>
      <input type="text" placeholder="Search by title..." />
      <select>
        <option value="">Select Category</option>
        <option value="rent">For Rent</option>
        <option value="sale">For Sale</option>
      </select>
      <button>Apply Filters</button>
    </div>
  );
};

export default FilterComponent;
