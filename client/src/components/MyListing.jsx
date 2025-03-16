import React, { useState, useEffect } from 'react';
import propertyService from '../services/propertyService';
import './MyListing.css';
import { useNavigate } from 'react-router-dom';

const MyListing = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchListings = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getMyListings();
        if (mounted) {
          setListings(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to fetch listings');
          setListings([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchListings();

    return () => {
      mounted = false;
    };
  }, []);

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.jp/800x600.png';
  };

  const handleUpdateClick = (propertyId) => {
    navigate(`/property-update/${propertyId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div>Loading your listings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="no-listings-container">
        <div>No listings found</div>
      </div>
    );
  }

  return (
    <div className="listings-container">
      {listings.map((listing) => (
        <div key={listing._id} className="my-listing-horizontal">
          <img 
            src={listing.imageSrc}
            alt={listing.type} 
            className="listing-image-horizontal"
            onError={handleImageError}
          />
          <div className="listing-details-horizontal">
            <h2 className="listing-title-horizontal">{listing.type}</h2>
            <p className="listing-description-horizontal">
              <strong>Location:</strong> {listing.location}
            </p>
            <p className="listing-size-horizontal">
              <strong>Size:</strong> {listing.size} sq ft
            </p>
            <p className="listing-price-horizontal">
              <strong>Price:</strong> ${listing.price}
            </p>
            <p className="listing-date-horizontal">
              <strong>Date: </strong>
              {new Date(listing.date).toLocaleDateString()}
            </p>
            <button 
              className="update-info-button-horizontal"
              onClick={() => handleUpdateClick(listing._id)}
            >
              Update Information
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyListing;
