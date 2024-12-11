import React, { useState } from 'react';
import OfferCard from './OfferCard';
import './OfferContainer.css';

const OfferContainer = () => {
  // Example offer data (this can come from an API or parent component)
  const [offers, setOffers] = useState([
    {
      id: 1,
      propertyId: 'P12345',
      buyerId: 'B67890',
      buyerName: 'John Doe',
      offerAmount: '$250,000',
      status: 'Pending',
      time: '2024-12-11 10:00 AM',
      tokenAmount: '$25,000',
    },
    {
      id: 2,
      propertyId: 'P12346',
      buyerId: 'B67891',
      buyerName: 'Jane Smith',
      offerAmount: '$300,000',
      status: 'Pending',
      time: '2024-12-11 11:30 AM',
      tokenAmount: '$30,000',
    },
  ]);

  const handleAccept = (id) => {
    console.log(`Offer ${id} accepted`);
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer.id === id ? { ...offer, status: 'Accepted' } : offer
      )
    );
  };

  const handleReject = (id) => {
    console.log(`Offer ${id} rejected`);
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer.id === id ? { ...offer, status: 'Rejected' } : offer
      )
    );
  };

  return (
    <div className="offer-container">
      <h5 className='heading-offer'>Total Offers Received</h5>
      <button className="container-reject-button">
      Reject All Offers
    </button>

      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          propertyId={offer.propertyId}
          buyerId={offer.buyerId}
          buyerName={offer.buyerName}
          offerAmount={offer.offerAmount}
          status={offer.status}
          time={offer.time}
          tokenAmount={offer.tokenAmount}
          onAccept={() => handleAccept(offer.id)}
          onReject={() => handleReject(offer.id)}
        />
      ))}
    </div>
  );
};

export default OfferContainer;
