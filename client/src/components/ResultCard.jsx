import React from "react";
import "./ResultCard.css";
import { useNavigate } from "react-router-dom";

const ResultCard = (props) => {
   console.log("Rendering Image URL:", props.imageUrl); // Debugging log
  const fallbackImage = "https://placehold.jp/150x150.png";
  const navigate = useNavigate();


  const handlePropertyDetails = () => {
    if (props.id) {
      navigate(`/property/${props.id}`); // Navigate dynamically
    }
  };

  return (
    <div onClick={handlePropertyDetails} className="result-card-ResultCard">
      <div className="image-container-ResultCard">
        {/* <img
          src={props.imageUrl || fallbackImage}
          alt={props.title || "Property Image"}
          className="image-ResultCard"
          onError={(e) => (e.target.src = fallbackImage)}
        /> */}
        <img
          src={props.imageUrl || fallbackImage}
          alt={props.title || "Property Image"}
          className="image-ResultCard"
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
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
