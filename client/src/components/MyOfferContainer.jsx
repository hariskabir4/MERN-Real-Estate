import React from 'react';
import MyOffers from './MyOffers';

const ParentComponent = () => {
  const offers = [
    {
      propertyId: "P12345",
      buyerId: "B67890",
      buyerName: "John Doe",
      offerAmount: "$500,000",
      status: "Pending",
      time: "2025-02-03",
      tokenAmount: "$5,000",
    },
    {
      propertyId: "P54321",
      buyerId: "B09876",
      buyerName: "Jane Smith",
      offerAmount: "$450,000",
      status: "Accepted",
      time: "2025-02-02",
      tokenAmount: "$4,500",
    },
    {
      propertyId: "P67890",
      buyerId: "B12345",
      buyerName: "Alice Brown",
      offerAmount: "$600,000",
      status: "Rejected",
      time: "2025-02-01",
      tokenAmount: "$6,000",
    }
  ];

  const handleAccept = (propertyId) => {
    console.log(`Offer for Property ID ${propertyId} accepted!`);
  };

  const handleReject = (propertyId) => {
    console.log(`Offer for Property ID ${propertyId} rejected!`);
  };

  return (
    <div>
       {/* <div className="offer-container"> */}
      <h2>Offer Placed</h2>
      {offers.map((offer, index) => (
        <MyOffers 
          key={index}
          propertyId={offer.propertyId}
          buyerId={offer.buyerId}
          buyerName={offer.buyerName}
          offerAmount={offer.offerAmount}
          status={offer.status}
          time={offer.time}
          tokenAmount={offer.tokenAmount}
          onAccept={() => handleAccept(offer.propertyId)}
          onReject={() => handleReject(offer.propertyId)}
        />
      ))}
    </div>
  );
};

export default ParentComponent;
