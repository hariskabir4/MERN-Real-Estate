import React from "react";
import "./Filter.css";

const Filter = () => {
  return (
    <div className="filter-container">
      <div className="filter-header">
        <button className="filter-tab active">Sale</button>
        <button className="filter-tab">Rent</button>
      </div>
      <div className="filter-body">
        <div className="filter-group">
          <label>Type</label>
          <div className="filter-options">
            <label>
              <input type="radio" name="type" /> Workplace
            </label>
            <label>
              <input type="radio" name="type" /> Housing
            </label>
            <label>
              <input type="radio" name="type" /> Land
            </label>
          </div>
        </div>
        <div className="filter-group">
          <label>Detailed Type</label>
          <select>
            <option>Select Detailed Type</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Location</label>
          <select>
            <option>Select Province</option>
          </select>
          <select>
            <option>Select District</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Price ($)</label>
          <div className="filter-range">
            <input type="text" placeholder="Min Price ($)" />
            <input type="text" placeholder="Max Price ($)" />
          </div>
        </div>
        <div className="filter-group">
          <label>Size (m²)</label>
          <div className="filter-range">
            <input type="text" placeholder="Min Size (m²)" />
            <input type="text" placeholder="Max Size (m²)" />
          </div>
        </div>
      </div>
      <div className="filter-header">
        <button className="filter-tab active">Search</button>
        <button className="filter-tab">Reset</button>
      </div>
    </div>
  );
};

export default Filter;