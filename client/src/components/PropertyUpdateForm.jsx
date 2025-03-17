import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import propertyService from '../services/propertyService';
import './PropertyUpdateForm.css';

const PropertyUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [currentImage, setCurrentImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getPropertyById(id);
        setPropertyData(data);
        
        // Set initial image if exists
        if (data.images && data.images.length > 0) {
          setCurrentImage(data.images[0]);
          setImagePreview(`/uploads/${data.images[0]}`);
        }
      } catch (err) {
        setError('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setNewImage(null);
    setCurrentImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();

      // Append all property data
      Object.keys(propertyData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, propertyData[key]);
        }
      });

      // Handle image update
      if (newImage) {
        formData.append('images', newImage);
      }
      
      // If current image is removed
      if (!newImage && !currentImage && propertyData.images) {
        formData.append('removedImages', JSON.stringify([propertyData.images[0]]));
      }

      await propertyService.updateProperty(id, formData);
      alert('Property updated successfully!');
      navigate('/my-listings');
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading-property-update">Loading property details...</div>;
  }

  if (error) {
    return <div className="error-property-update">{error}</div>;
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

          <div className="image-section-property-update">
            <label className="image-label-property-update">
              Property Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input-property-update"
              />
            </label>

            {imagePreview && (
              <div className="image-preview-wrapper-property-update">
                <img
                  src={imagePreview}
                  alt="Property"
                  className="image-preview-property-update"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-image-button-property-update"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="button-group-property-update">
            <button type="submit" className="btn-property-update btn-submit-property-update">
              Update Property
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/my-listings')} 
              className="btn-property-update btn-cancel-property-update"
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