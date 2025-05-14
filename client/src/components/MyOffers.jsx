import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../Usercontext';
import './MyOffers.css';

const MyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUserContext();
  const navigate = useNavigate();

  const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  useEffect(() => {
    const fetchMyOffers = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login', { 
          state: { 
            from: '/my-offers',
            intent: 'view-offers'
          } 
        });
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/offers/my-offers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login', { 
            state: { 
              from: '/my-offers',
              intent: 'view-offers'
            } 
          });
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch offers');
        }

        let data = await response.json();
        
        // Sort offers by date (most recent first)
        data = data.sort((a, b) => new Date(b.time) - new Date(a.time));
        
        // Filter out duplicate offers based on propertyId, keeping only the most recent
        const uniqueOffers = Array.from(
          data.reduce((map, offer) => {
            if (!map.has(offer.propertyId) || 
                new Date(offer.time) > new Date(map.get(offer.propertyId).time)) {
              map.set(offer.propertyId, offer);
            }
            return map;
          }, new Map()).values()
        );

        setOffers(uniqueOffers);
        setError(null);
      } catch (error) {
        console.error('Error fetching offers:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOffers();
  }, [navigate]);

  const renderContent = () => {
    if (loading) {
      return <div className="loading-spinner_MyOffer">Loading your offers...</div>;
    }

    if (error) {
      return (
        <div className="error-message_MyOffer">
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-button_MyOffer">
            Go Back
          </button>
        </div>
      );
    }

    if (offers.length === 0) {
      return <p className="no-offers_MyOffer">You haven't made any offers yet</p>;
    }

    return (
      <div className="offers-grid_MyOffer">
        {offers.map((offer) => (
          <div key={offer._id} className="offer-card_MyOffer">
            <div className="offer-content_MyOffer">
              {offer.property && (
                <div className="property-info_MyOffer">
                  <img
                    src={offer.property.images?.[0]
                      ? `http://localhost:5000/uploads/${offer.property.images[0]}`
                      : 'https://placehold.jp/300x200.png'}
                    alt="Property"
                    className="property-image_MyOffer"
                  />
                  <div className="property-details_MyOffer">
                    <h3>{offer.property.title || offer.property.type}</h3>
                    <p className="property-location_MyOffer">{offer.property.location}</p>
                    <p className="property-price_MyOffer">
                      Listed Price: PKR {offer.property.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              <div className="offer-details_MyOffer">
                <div className="offer-info_MyOffer">
                  <p>
                    <strong>Your Offer:</strong> PKR {Number(offer.offerAmount).toLocaleString()}
                  </p>
                  <p>
                    <strong>Token Amount:</strong> PKR {Number(offer.tokenAmount).toLocaleString()}
                  </p>
                  <p>
                    <strong>Date & Time:</strong> {formatDateTime(offer.time)}
                  </p>
                  <p className={`status_MyOffer ${offer.status.toLowerCase()}_MyOffer`}>
                    <strong>Status:</strong> {offer.status}
                  </p>
                </div>
                {offer.property && (
                  <button
                    onClick={() => navigate(`/property/${offer.propertyId}`)}
                    className="view-property-btn_MyOffer"
                  >
                    View Property
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="my-offers-container_MyOffer">
      <h2>My Offers</h2>
      {renderContent()}
    </div>
  );
};

export default MyOffers;
