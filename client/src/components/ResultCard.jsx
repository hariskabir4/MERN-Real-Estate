import React from 'react';
import './ResultCard.css';
import { useNavigate } from "react-router-dom";

const ResultCard = (props) => {
  const fallbackImage = 'https://via.placeholder.com/150';
  const navigate = useNavigate();

  const handlePropertyDetails = () => {
    navigate(`/property/${props.id}`); // Dynamically navigate to property details page
  };

  return (
    <div onClick={handlePropertyDetails} className="result-card-ResultCard">
      <div className="image-container-ResultCard">
        <img
          src={props.imageUrl || fallbackImage}
          alt={props.title || 'Property Image'}
          className="image-ResultCard"
        />
      </div>
      <div className="details-container-ResultCard">
        <div className="top-section-ResultCard">
          <span className="price-ResultCard">{props.price}</span>
          <span className="date-ResultCard">{props.date}</span>
        </div>
        <h3 className="title-ResultCard">{props.title}</h3>
        <p className="location-ResultCard">{props.location}</p>
      </div>
    </div>
  );
};

export default ResultCard;
