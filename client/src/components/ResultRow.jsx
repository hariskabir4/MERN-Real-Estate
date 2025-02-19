// import React from 'react';
// import ResultCard from './ResultCard';

// const ResultRow = ({ image, price, title, type, size, location, date }) => {
//   return (
//     <div className="result-row">
//       <ResultCard
//         imageUrl={image}
//         price={price}
//         title={title}
//         description={type} // Pass the property type as description
//         location={location}
//         date={date}
//       />
//     </div>
//   );
// };

// export default ResultRow;
 

import React from "react";
import ResultCard from "./ResultCard";

const ResultRow = ({ image, price, title, type, size, location, date }) => {
  console.log("✅ ResultRow - Received Props:", { image, price, title, type, size, location, date });

  return (
    <div className="result-row">
      <ResultCard
        imageUrl={image}
        price={price}
        title={title}
        description={type}
        location={location}
        date={date}
      />
    </div>
  );
};

export default ResultRow;
