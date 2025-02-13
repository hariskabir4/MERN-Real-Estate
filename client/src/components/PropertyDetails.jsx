// import React from "react";
// import "./PropertyDetail.css";
// import { Link, useNavigate } from "react-router-dom";

// const PropertyDetail = () => {
//      const navigate = useNavigate();

//     const handlechat = () => {
//         navigate("/chatpage");
//     }
//     const handleMakeOffer = () => {
//         navigate("/make-offer");
//     }


//     return (
//         <div className="property-detail">
//             <img
//                 src="/source1.jpg"
//                 alt="Property"
//                 className="property-image"
//             />
//             <div className="property-info">
//                 <h2>500 yards bungalow for sale in DHA karachi</h2>
//                 <p className="location">
//                     <span role="img" aria-label="location">
//                         📍
//                     </span>{" "}
//                     Saba Avenue, Phase VIII DHA, Karachi, Pakistan
//                 </p>
//                 {/* <span className="status for-rent">For Rent</span> */}
//                 <p className="description">
//                     <strong>Description: </strong>1000 Yards bungalow available for rent
//                 </p>
//                 <div className="property-features">
//                     <span>9 beds</span>
//                     <span>6 baths</span>
//                     <span>Parking spot</span>
//                     <span>Furnished</span>
//                 </div>
//                 <div className="actions">
//                     {/* <button className="contact-agent">Contact Agent</button> */}
//                     <button onClick={handlechat} className="chat-button">
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             strokeWidth="1.5"
//                             stroke="currentColor"
//                             className="chat-icon"
//                             style={{ width: "16px", height: "16px", marginRight: "5px" }}
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 d="M8.25 15h7.5M8.25 12h7.5m-10.5 9v-3.659a9.213 9.213 0 01-2.615-3.034A8.962 8.962 0 013 9.75C3 5.246 7.03 2.25 12 2.25s9 2.996 9 7.5-4.03 7.5-9 7.5c-.566 0-1.123-.039-1.667-.114A9.164 9.164 0 016.75 19.5z"
//                             />
//                         </svg>
//                         Chat
//                     </button>
//                     <button onClick={handleMakeOffer} className="make-offer">Make an Offer</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PropertyDetail;



import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/property/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) return <p>Loading...</p>;

  return (
    <div>
      <h2>{property.title || "No Title"}</h2>
      <p>Price: {property.price || "Not Available"}</p>
      <p>Location: {property.location || "Unknown"}</p>
      <p>Description: {property.description || "No Description Provided"}</p>
      <img src={property.image || "/default-image.jpg"} alt={property.title || "Property Image"} style={{ width: '300px' }} />
    </div>
  );
};

export default PropertyDetail;
