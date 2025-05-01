import React, { useEffect, useState } from 'react';
import OfferCard from './OfferCard';
import './OfferContainer.css';
import { useParams } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api/offers';

const OfferContainer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { propertyId } = useParams();

  useEffect(() => {
    if (propertyId) {
      fetch(`${API_BASE}/property/${propertyId}`)
        .then(res => res.json())
        .then(data => {
          setOffers(data);
          setLoading(false);
        });
    } else {
      fetch(API_BASE)
        .then(res => res.json())
        .then(data => {
          setOffers(data);
          setLoading(false);
        });
    }
  }, [propertyId]);

  const handleAccept = async (id) => {
    // Update offer status in backend (optional: implement PUT/PATCH in backend)
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer._id === id ? { ...offer, status: 'Accepted' } : offer
      )
    );
  };

  const handleReject = async (id) => {
    // Update offer status in backend (optional: implement PUT/PATCH in backend)
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer._id === id ? { ...offer, status: 'Rejected' } : offer
      )
    );
  };

  return (
    <div className="offer-container">
      <h5 className='heading-offer'>Total Offers Received</h5>
      <button className="container-reject-button">
      Reject All Offers
    </button>
      {loading ? <div>Loading...</div> : offers.map((offer) => (
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
  );
};

export default OfferContainer;
