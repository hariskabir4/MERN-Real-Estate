import React from 'react';
import './MyOffers.css';

const MyOffers = (props) => {
  return (
    <div className="offer-card_My_Offers">
      <p><strong>Property ID:</strong> {props.propertyId}</p>
      <p><strong>Buyer ID:</strong> {props.buyerId}</p>
      <p><strong>Buyer Name:</strong> {props.buyerName}</p>
      <p><strong>Offer Amount:</strong> {props.offerAmount}</p>
      <p><strong>Date of Offer:</strong> {props.time}</p>
      <p><strong>Token Amount:</strong> {props.tokenAmount}</p>     
      <p><strong>Status:</strong> {props.status}</p>
    </div>
  );
};

export default MyOffers;
