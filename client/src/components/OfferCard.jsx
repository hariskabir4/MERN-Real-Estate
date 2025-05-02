import React from 'react';
import './OfferContainer.css';

const OfferCard = ({
  buyerName,
  offerAmount,
  tokenAmount,
  status,
  time,
  onAccept,
  onReject
}) => {
  return (
    <div className="offer-card_OfferContainer">
      <div className="offer-card-header_OfferContainer">
        <h3>{buyerName}</h3>
        <span className={`offer-status_OfferContainer ${status}`}>{status}</span>
      </div>
      
      <div className="offer-card-body_OfferContainer">
        <div className="offer-details_OfferContainer">
          <div className="offer-detail-item_OfferContainer">
            <span className="offer-detail-label_OfferContainer">Offer Amount:</span>
            <span className="offer-detail-value_OfferContainer">PKR {Number(offerAmount).toLocaleString()}</span>
          </div>
          <div className="offer-detail-item_OfferContainer">
            <span className="offer-detail-label_OfferContainer">Token Amount:</span>
            <span className="offer-detail-value_OfferContainer">PKR {Number(tokenAmount).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="offer-date_OfferContainer">
          Offered on: {new Date(time).toLocaleString()}
        </div>
      </div>

      {status === 'Pending' && (
        <div className="offer-card-actions_OfferContainer">
          <button className="accept-button_OfferContainer" onClick={onAccept}>
            Accept
          </button>
          <button className="reject-button_OfferContainer" onClick={onReject}>
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default OfferCard;
