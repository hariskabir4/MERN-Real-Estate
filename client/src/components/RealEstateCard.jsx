import React from 'react';
import './RealEstateCard.css';
import { Link, useNavigate } from "react-router-dom";

const RealEstateCard = (props) => {

  const navigate = useNavigate();

  const handlePropertyDetails = () => {
    navigate("/PropertyDetails");
  }

  return (
    <div onClick={handlePropertyDetails} className="card">
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
