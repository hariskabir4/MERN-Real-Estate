import React from "react";
import "./ResultRow.css";

const ResultRow = ({ image, price, title, type, size, location, date }) => {
  return (
    <div className="result-row">
      <img src={image} alt={title} className="result-image" />
      <div className="result-info">
        <h3 className="result-price">{price}</h3>
        <h4 className="result-title">{title}</h4>
        <p className="result-details">
          {type} | {size}
        </p>
        <p className="result-location">{location}</p>
      </div>
      <p className="result-date">{date}</p>
    </div>
  );
};

export default ResultRow;
