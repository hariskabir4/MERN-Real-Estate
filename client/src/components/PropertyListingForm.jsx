import React from "react";
import "./PropertyListingForm.css";

const PropertyListingForm = () => {
  return (
    <div className="container-listing">
      <div className="form-container-listing">
        <form className="property-form-listing">
          <h2>Property Listing</h2>
          <input
            type="text"
            placeholder="Property Title"
            className="input-field-listing"
          />
          <textarea
            placeholder="Property Description"
            className="textarea-field-listing"
          ></textarea>
          <select className="input-field-listing">
            <option>Select Property Type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="rental">Rental</option>
          </select>
          <input
            type="number"
            placeholder="Price in USD"
            className="input-field-listing"
          />
          <input
            type="text"
            placeholder="Address"
            className="input-field-listing"
          />
          <input
            type="text"
            placeholder="City"
            className="input-field-listing"
          />
          <input
            type="text"
            placeholder="State"
            className="input-field-listing"
          />
          <input
            type="text"
            placeholder="Postal Code"
            className="input-field-listing"
          />
          <input
            type="text"
            placeholder="Features (comma-separated)"
            className="input-field-listing"
          />
          <select className="input-field-listing">
            <option>Select Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
          <input
            type="file"
            multiple
            className="file-input-listing"
          />
          <button type="submit" className="submit-button-listing">
            Submit
          </button>
        </form>
      </div>

      <div className="image-container-listing"></div>
    </div>
  );
};

export default PropertyListingForm;
