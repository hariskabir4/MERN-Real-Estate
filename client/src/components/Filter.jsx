import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Filter.css";

const Filter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({
    purpose: "Sale",
    type: "",
    detailedType: "",
    province: "",
    district: "",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    maxSize: "",
  });

  const handlePurposeChange = (purpose) => {
    setFilters({ ...filters, purpose });
  };

  const handleTypeChange = (e) => {
    setFilters({ ...filters, type: e.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    // Map "Sale" to "Sell" for backend compatibility
    if (filters.purpose) {
        searchParams.append("category", filters.purpose);
    }
    if (filters.type) searchParams.append("type", filters.type);
    if (filters.province) searchParams.append("state", filters.province);
    if (filters.district) searchParams.append("city", filters.district);
    if (filters.minPrice) searchParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) searchParams.append("maxPrice", filters.maxPrice);
    if (filters.minSize) searchParams.append("minSize", filters.minSize);
    if (filters.maxSize) searchParams.append("maxSize", filters.maxSize);

    navigate(`/search-results?${searchParams.toString()}`);
  };

  const handleReset = () => {
    setFilters({
      purpose: "Sale",
      type: "",
      detailedType: "",
      province: "",
      district: "",
      minPrice: "",
      maxPrice: "",
      minSize: "",
      maxSize: "",
    });
    navigate("/search-results");
  };

  return (
    <div className="bunyaad-filter-container">
      <div className="bunyaad-filter-header">
        <button 
          className={`bunyaad-filter-tab ${filters.purpose === "Sale" ? "active" : ""}`}
          onClick={() => handlePurposeChange("Sale")}
        >
          Sale
        </button>
        <button 
          className={`bunyaad-filter-tab ${filters.purpose === "Rent" ? "active" : ""}`}
          onClick={() => handlePurposeChange("Rent")}
        >
          Rent
        </button>
      </div>
      <div className="bunyaad-filter-body">
        <div className="bunyaad-filter-group">
          <label>Type</label>
          <div className="bunyaad-filter-options">
            <label>
              <input 
                type="radio" 
                name="type" 
                value="Workplace"
                checked={filters.type === "Workplace"}
                onChange={handleTypeChange}
              /> Workplace
            </label>
            <label>
              <input 
                type="radio" 
                name="type" 
                value="Housing"
                checked={filters.type === "Housing"}
                onChange={handleTypeChange}
              /> Housing
            </label>
            <label>
              <input 
                type="radio" 
                name="type" 
                value="Land"
                checked={filters.type === "Land"}
                onChange={handleTypeChange}
              /> Land
            </label>
          </div>
        </div>
        <div className="bunyaad-filter-group">
          <label>Location</label>
          <select 
            name="province"
            value={filters.province}
            onChange={handleInputChange}
          >
            <option value="">Select Province</option>
            <option value="Punjab">Punjab</option>
            <option value="Sindh">Sindh</option>
            <option value="KPK">KPK</option>
            <option value="Balochistan">Balochistan</option>
          </select>
          <select 
            name="district"
            value={filters.district}
            onChange={handleInputChange}
          >
            <option value="">Select District</option>
            <option value="Lahore">Lahore</option>
            <option value="Karachi">Karachi</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Peshawar">Peshawar</option>
          </select>
        </div>
        <div className="bunyaad-filter-group">
          <label>Price ($)</label>
          <div className="bunyaad-filter-price-inputs">
            <input 
              type="number"
              name="minPrice"
              placeholder="Min Price ($)"
              value={filters.minPrice}
              onChange={handleInputChange}
              className="bunyaad-price-input"
            />
            <input 
              type="number"
              name="maxPrice"
              placeholder="Max Price ($)"
              value={filters.maxPrice}
              onChange={handleInputChange}
              className="bunyaad-price-input"
            />
          </div>
        </div>
        <div className="bunyaad-filter-group">
          <label>Size (m²)</label>
          <div className="bunyaad-filter-size-inputs">
            <input 
              type="number"
              name="minSize"
              placeholder="Min Size (m²)"
              value={filters.minSize}
              onChange={handleInputChange}
              className="bunyaad-size-input"
            />
            <input 
              type="number"
              name="maxSize"
              placeholder="Max Size (m²)"
              value={filters.maxSize}
              onChange={handleInputChange}
              className="bunyaad-size-input"
            />
          </div>
        </div>
      </div>
      <div className="bunyaad-filter-header">
        <button className="bunyaad-filter-tab active" onClick={handleSearch}>Search</button>
        <button className="bunyaad-filter-tab" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default Filter;