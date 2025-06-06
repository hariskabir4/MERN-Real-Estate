import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PropertyListingForm.css";

const PropertyListingForm = () => {
  const [propertyType, setPropertyType] = useState("Residential");
  const [formData, setFormData] = useState({
    title: "",
    owner: "",
    location: "",
    price: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    purpose: "Sell",
    features: "",
    status: "available",
    city: "",
    state: "",
  });
  const [images, setImages] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Stored token:', token);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["price", "size", "bedrooms", "bathrooms"].includes(name) && value < 0) {
      alert(`${name.charAt(0).toUpperCase() + name.slice(1)} cannot be negative`);
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      
      // Debug logging
      console.log('Sending token:', token);
      
      if (!token) {
        alert("Please login first");
        return;
      }

      const formDataToSubmit = new FormData();
      formDataToSubmit.append("propertyType", propertyType);

      // Append other form fields
      for (const key in formData) {
        formDataToSubmit.append(key, formData[key]);
      }

      // Append images (if any)
      if (images) {
        Array.from(images).forEach((image) => {
          formDataToSubmit.append("images", image);
        });
      }

      const response = await axios.post(
        "http://localhost:5000/api/properties/new-listing",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}` // Make sure Bearer prefix is added
          },
        }
      );

      alert("Property listed successfully!");
      // Reset form
      setFormData({
        title: "",
        owner: "",
        location: "",
        price: "",
        size: "",
        bedrooms: "",
        bathrooms: "",
        purpose: "Sell",
        features: "",
        status: "available",
        city: "",
        state: "",
      });
      setImages(null);
    } catch (error) {
      console.error("Token being used:", localStorage.getItem('authToken'));
      console.error("Full error:", error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken'); // Clear invalid token
        alert("Your session has expired. Please login again.");
        window.location.href = '/login'; // Redirect to login page
      } else {
        alert("Failed to list property. Please try again.");
      }
    }
  };

  return (
    <div className="container-listing">
      <div className="form-container-listing">
        <form className="property-form-listing" onSubmit={handleSubmit}>
          <h2>Property Listing</h2>

          <input
            type="text"
            placeholder="Property Title"
            className="input-field-listing"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            placeholder="Owner Name"
            className="input-field-listing"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            required
          />

          <div className="input-row">
            <select
              className="input-field-listing small-input"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>

            <select
              className="input-field-listing small-input"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
            >
              <option value="Sell">Sell</option>
              <option value="Rent">Rent</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Address"
            className="input-field-listing"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <div className="input-row">
            <input
              type="number"
              placeholder="Size (sq ft)"
              className="input-field-listing small-input"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              placeholder="Price in USD"
              className="input-field-listing small-input"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-row">
            <input
              type="text"
              placeholder="City"
              className="input-field-listing small-input"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="State"
              className="input-field-listing small-input"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-row">
            <input
              type="number"
              placeholder="Bedrooms"
              className="input-field-listing small-input"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Bathrooms"
              className="input-field-listing small-input"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
            />
          </div>

          <textarea
            placeholder="Features"
            className="input-field-listing"
            name="features"
            value={formData.features}
            onChange={handleChange}
          ></textarea>

          <input
            type="file"
            className="input-field-listing"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />

          <button type="submit" className="btn-listing">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyListingForm;
