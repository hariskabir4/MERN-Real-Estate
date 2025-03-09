import React, { useState } from "react";
import "./AIPropertyEstimation.css"; // Import CSS file

const AIPropertyEstimation = () => {
  const [price, setPrice] = useState(null);

  const handleEstimate = () => {
    const randomPrice = Math.floor(Math.random() * (500000 - 200000) + 200000);
    setPrice(`$${randomPrice.toLocaleString()}`);
  };

  return (
    <div className="background_AI_appraisal">
      {/* <h6 className="header_AI_appraisal">Bunyaad AI Property Valuation</h6> */}

      <div className="container_AI_appraisal">
        <h2 className="title_AI_appraisal">AI Property Price Estimation</h2>

        <div className="form_AI_appraisal">
          {/* First Row */}
          <div className="form_row_AI_appraisal">
            <input type="text" placeholder="City" />
            <input type="text" placeholder="Location" />
            <select>
              <option>House</option>
              <option>Apartment</option>
              <option>Land</option>
              <option>Shop</option>
              <option>Office</option>
            </select>
          </div>

          {/* Second Row */}
          <div className="form_row_AI_appraisal">
            <select>
              <option>Residential</option>
              <option>Commercial</option>
            </select>
            <input type="number" placeholder="Size (sq ft)" />
          </div>

          {/* Third Row */}
          <div className="form_row_AI_appraisal">
            <input type="number" placeholder="Rooms" />
            <input type="number" placeholder="Bathrooms" />
          </div>

          {/* Checkboxes */}
          <div className="checkboxes_AI_appraisal">
            <label><input type="checkbox" /> Corner Plot</label>
            <label><input type="checkbox" /> Parking Available</label>
            <label><input type="checkbox" /> Near School</label>
            <label><input type="checkbox" /> Near Hospital</label>
          </div>

          <button className="btn_AI_appraisal" onClick={handleEstimate}>
            Estimate Price
          </button>
        </div>

        {/* Result Card */}
        {price && (
          <div className="result_card_AI_appraisal">
            {/* <h3>Estimated Price: {price}</h3> */}
            <h3>Estimated Price: <span className="price_highlight_AI">{price}</span></h3>
            <p>
              AI can make mistakes. For more accurate results, please request an  
              <a href="/onsiteInspectionRequestForm"> onsite inspection</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPropertyEstimation;
