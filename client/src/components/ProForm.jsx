import React, { useState } from "react";
import axios from "axios";
import "./ProForm.css";

const ProForm = () => {
  const [propertyType, setPropertyType] = useState("Residential"); // Residential or Commercial
  const [formData, setFormData] = useState({
    title: "",
    owner: "",
    location: "",
    price: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    purpose: "Sell", // Sell or Rent
    features: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative values
    if (["price", "size", "bedrooms", "bathrooms"].includes(name) && value < 0) {
      alert(`${name.charAt(0).toUpperCase() + name.slice(1)} cannot be negative`);
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/properties/new-listing", { propertyType, ...formData });

      alert("Property listed successfully!");
    } catch (error) {
      console.error("Error listing property:", error);
      alert("Failed to list property.");
    }
  };

  return (
    <div className="property-body">
      <div className="property-form-div">
        <h2 className="property-form-h2">List a Property</h2>
        <form className="property-form-form" onSubmit={handleSubmit}>
          <label className="property-form-label">
            Title:
            <input
              className="property-form-input"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label className="property-form-label">
            Owner Name:
            <input
              className="property-form-input"
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              required
            />
          </label>

          <label className="property-form-label">
            Location:
            <input
              className="property-form-input"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </label>

          <label className="property-form-label">
            Price:
            <input
              className="property-form-input"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>

          <label className="property-form-label">
            Size (sq ft):
            <input
              className="property-form-input"
              type="number"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
            />
          </label>

          {propertyType === "Residential" && (
            <>
              <label className="property-form-label">
                Bedrooms:
                <input
                  className="property-form-input"
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                />
              </label>
              <label className="property-form-label">
                Bathrooms:
                <input
                  className="property-form-input"
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                />
              </label>
            </>
          )}

          <label className="property-form-label">
            Purpose:
            <select
              className="property-form-select"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
            >
              <option value="Sell">Sell</option>
              <option value="Rent">Rent</option>
            </select>
          </label>

          <label className="property-form-label">
            Property Type:
            <select
              className="property-form-select"
              name="propertyType"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          </label>

          <label className="property-form-label">
            Features:
            <textarea
              className="property-form-textarea"
              name="features"
              value={formData.features}
              onChange={handleChange}
            />
          </label>

          <button className="property-form-button" type="submit">
            List Property
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProForm;
