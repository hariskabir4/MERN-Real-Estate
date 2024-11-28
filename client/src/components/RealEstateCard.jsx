import React from 'react';
import './RealEstateCard.css';

const RealEstateCard = (props) => {
  return (
    <div className="card">
      <div className="card-image">
        <img src={props.imageSrc} alt="Real Estate" />
        <button className="favorite-btn">&#x2661;</button>
      </div>
      <div className="card-content">
        <h2 className="price">${props.price}</h2>
        <p className="details">
          {props.type}, {props.size} Sqft
        </p>
        <p className="location">{props.location}</p>
        <p className="date">{props.date}</p>
      </div>
    </div>
  );
};

export default RealEstateCard;
