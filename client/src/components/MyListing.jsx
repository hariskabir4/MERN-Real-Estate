import React from 'react';
import './MyListing.css';

const MyListing = (props) => {
  return (
    <div className="my-listing-horizontal">
      <img src={props.imageSrc} alt={props.type} className="listing-image-horizontal" />
      <div className="listing-details-horizontal">
        <h2 className="listing-title-horizontal">{props.type}</h2>
        <p className="listing-description-horizontal">
          <strong>Location:</strong> {props.location}
        </p>
        <p className="listing-size-horizontal">
          <strong>Size:</strong> {props.size} sq ft
        </p>
        <p className="listing-price-horizontal">
          <strong>Price:</strong> ${props.price}
        </p>
        <p className="listing-date-horizontal">
        <strong>Date:  </strong>{props.date}
           </p>
        <button className="update-info-button-horizontal">Update Information</button>
      </div>
    </div>
  );
};

export default MyListing;
