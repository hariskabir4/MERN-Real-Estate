import React from 'react';
import './ResultCard.css';

const ResultCard = (props) => {
  // Fallback URL if imageUrl is empty
  const fallbackImage = 'https://via.placeholder.com/150';

  return (
    <div className="result-card-ResultCard">
      <div className="image-container-ResultCard">
        <img
          src={props.imageUrl || fallbackImage} // Use fallback if imageUrl is empty
          alt={props.title || 'Property Image'} // Add meaningful alt text
          className="image-ResultCard"
        />
      </div>
      <div className="details-container-ResultCard">
        <div className="top-section-ResultCard">
          <span className="price-ResultCard">{props.price}</span>
          <span className="date-ResultCard">{props.date}</span>
        </div>
        <h3 className="title-ResultCard">{props.title}</h3>
        <p className="description-ResultCard">{props.description}</p>
        <p className="location-ResultCard">{props.location}</p>
      </div>
    </div>
  );
};

export default ResultCard;
