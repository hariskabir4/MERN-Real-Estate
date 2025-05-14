import React, { useState, useEffect } from 'react';
import RealEstateCard from './RealEstateCard';

const TopProperties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/properties/top')
      .then(response => response.json())
      .then(data => setProperties(data))
      .catch(error => console.error('Error fetching top properties:', error));
  }, []);

  return (
    <div className="properties-grid">
      {properties.map(property => (
        <RealEstateCard
          key={property._id}
          id={property._id}
          imageSrc={`http://localhost:5000/uploads/${property.images[0]}`}
          price={property.price}
          type={property.purpose}
          size={property.size}
          location={property.location}
          date={new Date(property.listedAt).toLocaleDateString()}
        />
      ))}
    </div>
  );
};

export default TopProperties; 