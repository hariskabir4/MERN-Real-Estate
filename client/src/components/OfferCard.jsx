import React from 'react';
import './OfferCard.css';

const OfferCard = (props) => {
  return (
    <div className="offer-card">
      <p><strong>Property ID:</strong> {props.propertyId}</p>
      <p><strong>Buyer ID:</strong> {props.buyerId}</p>
      <p><strong>Buyer Name:</strong> {props.buyerName}</p>
      <p><strong>Offer Amount:</strong> {props.offerAmount}</p>
      <p><strong>Status:</strong> {props.status}</p>
      <p><strong>Time of Offer:</strong> {props.time}</p>
      <p><strong>Token Amount:</strong> {props.tokenAmount}</p>
      <div className="offer-actions">
        <button className="accept-button" onClick={props.onAccept}>Accept</button>
        <button className="reject-button" onClick={props.onReject}>Reject</button>
      </div>
    </div>
  );
};

export default OfferCard;
