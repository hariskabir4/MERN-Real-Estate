import React from 'react';
import './ParentLayout.css';
import Filter from './Filter'; 
import ResultCard from './ResultCard'; 


const ParentLayout = () => {
  const results = [
    {
      imageUrl: '/source1.jpg', // This will now use the fallback image
      title: '500 yards bungalow for sale in DHA karachi',
      description: 'Bunglow for sale | 5 + 1 rooms | DHA Phase VI | 2024',
      location: 'Karachi, Pakistan',
      price: '$200,000 ',
      date: '7.12.2024',
    },
    {
      imageUrl: '/source1.jpg', // This will now use the fallback image
      title: 'Appartment for sale in Clifton',
      description: 'Apartment For Sale | 180 m² | 4+1 | 6. Floor | 2024',
      location: 'Karachi,Pakistan',
      price: '200,000 $',
      date: '10.02.2024',
    },
    {
      imageUrl: '/source1.jpg', // This will now use the fallback image
      title: 'Office for Sale',
      description: 'Office For Sale | 180 m² | 6. Shahr-e-Faisal | 2024',
      location: 'Karachi,Pakistan',
      price: '200,000 $',
      date: '10.02.2024',
    },
    {
      imageUrl: '/source1.jpg', // This will now use the fallback image
      title: '4+1 Apartment for sale in Mamak, Ankara',
      description: 'Apartment For Sale | 180 m² | 4+1 | 6. Floor | 2019',
      location: 'Mamak, Ankara',
      price: '200,000 $',
      date: '10.02.2024',
    },
    {
      imageUrl: 'https://via.placeholder.com/150',
      title: '3+1 Apartment for sale in Altindag, Ankara',
      description: 'Apartment For Sale | 120 m² | 3+1 | 5. Floor | 2020',
      location: 'Altindag, Ankara',
      price: '150,000 $',
      date: '09.02.2024',
    },
  ];

  return (
    <div className="layout-container">
      {/* Filter Component */}
      <div className="filter-container-1">
        <Filter />
      </div>

      {/* ResultCard Component */}
      <div className="result-container">
        {results.map((result, index) => (
          <ResultCard
            key={index}
            imageUrl={result.imageUrl}
            title={result.title}
            description={result.description}
            location={result.location}
            price={result.price}
            date={result.date}
          />
        ))}
      </div>
    </div>
  );
};

export default ParentLayout;
