import React, { useEffect, useState } from 'react';
import OfferCard from './OfferCard';
import './OfferContainer.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../Usercontext';

const API_BASE = 'http://localhost:5000/api/offers';

const OfferContainer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const { propertyId } = useParams();
  const { user } = useUserContext();
  const navigate = useNavigate();

  // Fetch user's properties
  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login', { 
            state: { 
              from: `/view-offers${propertyId ? `/${propertyId}` : ''}`,
              intent: 'view-offers'
            } 
          });
          return;
        }

        const response = await fetch('http://localhost:5000/api/properties/my-listings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login', { 
            state: { 
              from: `/view-offers${propertyId ? `/${propertyId}` : ''}`,
              intent: 'view-offers'
            } 
          });
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        setUserProperties(data);
        
        // Only set selectedPropertyId if propertyId is provided in URL
        if (propertyId) {
          setSelectedPropertyId(propertyId);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load your properties');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, [navigate, propertyId]);

  // Fetch offers for selected property
  useEffect(() => {
    const fetchOffers = async () => {
      if (!selectedPropertyId) {
        setOffers([]);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError("Authentication token not found. Please login again.");
          setLoading(false);
          navigate('/login', {
            state: { 
              from: `/view-offers${selectedPropertyId ? `/${selectedPropertyId}` : ''}`,
              intent: 'view-offers'
            }
          });
          return;
        }

        const response = await fetch(`${API_BASE}/property/${selectedPropertyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('authToken');
          setError("Session expired. Please login again.");
          navigate('/login', {
            state: { 
              from: `/view-offers${selectedPropertyId ? `/${selectedPropertyId}` : ''}`,
              intent: 'view-offers'
            }
          });
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch offers");
        }

        const data = await response.json();
        setOffers(data);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedPropertyId) {
      setLoading(true);
      fetchOffers();
    }
  }, [selectedPropertyId, navigate]);

  const handlePropertyChange = (e) => {
    const newPropertyId = e.target.value;
    setSelectedPropertyId(newPropertyId);
  };

  const handleAccept = async (id) => {
    // Prompt the property owner to provide their account address
    const ownerAccount = prompt("Please enter your account address to receive the token amount:");
    if (!ownerAccount) {
      alert("Account address is required to accept the offer.");
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/${id}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ownerAccount }) // Send the owner's account address to the backend
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept offer');
      }

      const updatedOffer = await response.json();
      setOffers(prevOffers =>
        prevOffers.map(offer =>
          offer._id === id ? updatedOffer : offer
        )
      );
    } catch (error) {
      console.error('Error accepting offer:', error);
      setError(error.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject offer');
      }

      const updatedOffer = await response.json();
      setOffers(prevOffers =>
        prevOffers.map(offer =>
          offer._id === id ? updatedOffer : offer
        )
      );
    } catch (error) {
      console.error('Error rejecting offer:', error);
      setError(error.message);
    }
  };

  // Add sorting function
  const sortOffers = (offers) => {
    if (!offers) return [];
    
    return [...offers].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.time) - new Date(a.time);
      } else if (sortBy === 'price') {
        return Number(b.offerAmount) - Number(a.offerAmount);
      }
      return 0;
    });
  };

  if (loading) {
    return (
      <div className="offer-container_OfferContainer">
        <div className="loading-spinner_OfferContainer">Loading offers...</div>
      </div>
    );
  }

  const selectedProperty = userProperties.find(p => p._id === selectedPropertyId);

  return (
    <div className="offer-container_OfferContainer">
      <div className="filters-section_OfferContainer">
        <div className="property-selector_OfferContainer">
          <label htmlFor="propertySelect_OfferContainer">Select Property:</label>
          <select 
            id="propertySelect_OfferContainer"
            value={selectedPropertyId}
            onChange={handlePropertyChange}
            className="property-select_OfferContainer"
          >
            <option value="">Select a property</option>
            {userProperties.map(property => (
              <option key={property._id} value={property._id}>
                {property.title || property.type} - {property.location}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-selector_OfferContainer">
          <label htmlFor="sortSelect_OfferContainer">Sort By:</label>
          <select 
            id="sortSelect_OfferContainer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select_OfferContainer"
          >
            <option value="date">Date (Newest First)</option>
            <option value="price">Price (Highest First)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message_OfferContainer">
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-button_OfferContainer">Go Back</button>
        </div>
      )}

      {selectedPropertyId && selectedProperty && (
        <>
          <h2 className="heading-offer_OfferContainer">
            Offers for {selectedProperty.title || selectedProperty.type}
          </h2>
          {offers.length > 0 ? (
            <>
              <button 
                className="container-reject-button_OfferContainer" 
                onClick={() => offers.forEach(offer => handleReject(offer._id))}
              >
      Reject All Offers
    </button>
              <div className="offers-grid_OfferContainer">
                {sortOffers(offers).map((offer) => (
        <OfferCard
                    key={offer._id}
          propertyId={offer.propertyId}
          buyerId={offer.buyerId}
          buyerName={offer.buyerName}
          offerAmount={offer.offerAmount}
          status={offer.status}
          time={offer.time}
          tokenAmount={offer.tokenAmount}
                    onAccept={() => handleAccept(offer._id)}
                    onReject={() => handleReject(offer._id)}
        />
      ))}
              </div>
            </>
          ) : (
            <p className="no-offers_OfferContainer">No offers received yet for this property</p>
          )}
        </>
      )}

      {!selectedPropertyId && userProperties.length > 0 && (
        <p className="no-property-selected_OfferContainer">
          Please select a property to view offers
        </p>
      )}

      {userProperties.length === 0 && (
        <p className="no-offers_OfferContainer">You don't have any properties listed yet</p>
      )}
    </div>
  );
};

export default OfferContainer;
