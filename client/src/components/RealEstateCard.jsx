import React from 'react';
import './RealEstateCard.css';

const RealEstateCard = (props) => {
  return (
    <div className="real-card">
      <div className="real-card-image">
        <img src={props.imageSrc} alt="Real Estate" />
        <button className="real-favorite-btn">&#x2661;</button>
      </div>
      <div className="real-card-content">
        <h2 className="real-price">${props.price}</h2>
        <p className="real-details">
          {props.type}, {props.size} Sqft
        </p>
        <p className="real-location">{props.location}</p>
        <p className="real-date">{props.date}</p>
      </div>
    </div>
  );
};

export default RealEstateCard;
