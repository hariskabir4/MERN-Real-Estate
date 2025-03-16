import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import propertyService from '../services/propertyService';
import './PropertyUpdateForm.css';

const PropertyUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [propertyData, setPropertyData] = useState({
    title: '',
    owner: '',
    location: '',
    price: '',
    size: '',
    purpose: '',
    features: '',
    city: '',
    state: '',
    status: '',
    bedrooms: '',
    bathrooms: ''
  });

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getPropertyById(id);
        setPropertyData(data);
      } catch (err) {
        setError('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate numeric fields
    if (["price", "size", "bedrooms", "bathrooms"].includes(name)) {
      if (value && value < 0) {
        alert(`${name.charAt(0).toUpperCase() + name.slice(1)} cannot be negative`);
        return;
      }
    }

    setPropertyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Format the data before sending
      const formattedData = {
        ...propertyData,
        price: Number(propertyData.price),
        size: Number(propertyData.size),
        bedrooms: propertyData.bedrooms ? Number(propertyData.bedrooms) : undefined,
        bathrooms: propertyData.bathrooms ? Number(propertyData.bathrooms) : undefined
      };

      await propertyService.updateProperty(id, formattedData);
      setUpdateSuccess(true);
      
      // Show success message and redirect
      alert('Property updated successfully!');
      navigate('/my-listings');
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-property-update">Loading property details...</div>;
  }

  if (error) {
    return (
      <div className="error-property-update">
        <p>{error}</p>
        <button 
          onClick={() => navigate('/my-listings')}
          className="btn-property-update btn-cancel-property-update"
        >
          Return to My Listings
        </button>
      </div>
    );
  }

  return (
    <div className="container-property-update">
      <div className="form-container-property-update">
        <h2 className="property-update-title">Update Property Information</h2>
        <form onSubmit={handleSubmit} className="property-update-form">
          <input
            type="text"
            placeholder="Property Title"
            className="input-field-property-update"
            name="title"
            value={propertyData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            placeholder="Owner Name"
            className="input-field-property-update"
            name="owner"
            value={propertyData.owner}
            onChange={handleChange}
            required
          />

          <div className="input-row-property-update">
            <select
              className="input-field-property-update small-input-property-update"
              name="purpose"
              value={propertyData.purpose}
              onChange={handleChange}
            >
              <option value="Sell">Sell</option>
              <option value="Rent">Rent</option>
            </select>

            <select
              className="input-field-property-update small-input-property-update"
              name="status"
              value={propertyData.status}
              onChange={handleChange}
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Address"
            className="input-field-property-update"
            name="location"
            value={propertyData.location}
            onChange={handleChange}
            required
          />

          <div className="input-row-property-update">
            <input
              type="number"
              placeholder="Size (sq ft)"
              className="input-field-property-update small-input-property-update"
              name="size"
              value={propertyData.size}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              placeholder="Price in USD"
              className="input-field-property-update small-input-property-update"
              name="price"
              value={propertyData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-row-property-update">
            <input
              type="text"
              placeholder="City"
              className="input-field-property-update small-input-property-update"
              name="city"
              value={propertyData.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="State"
              className="input-field-property-update small-input-property-update"
              name="state"
              value={propertyData.state}
              onChange={handleChange}
              required
            />
          </div>

          {propertyData.bedrooms !== undefined && (
            <div className="input-row-property-update">
              <input
                type="number"
                placeholder="Bedrooms"
                className="input-field-property-update small-input-property-update"
                name="bedrooms"
                value={propertyData.bedrooms}
                onChange={handleChange}
              />
              <input
                type="number"
                placeholder="Bathrooms"
                className="input-field-property-update small-input-property-update"
                name="bathrooms"
                value={propertyData.bathrooms}
                onChange={handleChange}
              />
            </div>
          )}

          <textarea
            placeholder="Features"
            className="textarea-property-update"
            name="features"
            value={propertyData.features}
            onChange={handleChange}
          />

          {updateSuccess && (
            <div className="success-message-property-update">
              Property updated successfully!
            </div>
          )}

          <div className="button-group-property-update">
            <button 
              type="submit" 
              className="btn-property-update btn-submit-property-update"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Property'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/my-listings')} 
              className="btn-property-update btn-cancel-property-update"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyUpdateForm; 