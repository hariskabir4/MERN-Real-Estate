import React, { useState } from "react";
import "./AIPropertyEstimation.css"; // Import CSS file

const AIPropertyEstimation = () => {
  const [price, setPrice] = useState(null);
  const [transactionType_AI_appraisal, setTransactionType_AI_appraisal] = useState("Sale");
  const [propertyType_AI_appraisal, setPropertyType_AI_appraisal] = useState("Residential");
  const [size_AI_appraisal, setSize_AI_appraisal] = useState("");
  const [sizeUnit_AI_appraisal, setSizeUnit_AI_appraisal] = useState("Sqyd");
  const [rooms_AI_appraisal, setRooms_AI_appraisal] = useState("");
  const [bathrooms_AI_appraisal, setBathrooms_AI_appraisal] = useState("");
  const [location_AI_appraisal, setLocation_AI_appraisal] = useState("");
  const [city_AI_appraisal, setCity_AI_appraisal] = useState("");
  const [houseType_AI_appraisal, setHouseType_AI_appraisal] = useState("House");

  const handleEstimate = async () => {
    const payload = {
      area: size_AI_appraisal && sizeUnit_AI_appraisal ? `${size_AI_appraisal} ${sizeUnit_AI_appraisal}` : "",
      bedroom: rooms_AI_appraisal,
      bath: bathrooms_AI_appraisal,
      location: location_AI_appraisal,
      location_city: city_AI_appraisal,
      type: houseType_AI_appraisal,
      property_type: propertyType_AI_appraisal,
      classified_purpose: transactionType_AI_appraisal
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setPrice(`PKR: ${data.predicted_price_pkr?.toLocaleString() || data.predicted_price_pkr}`);
    } catch (error) {
      setPrice("Error fetching price");
    }
  };

  return (
    <div className="background_AI_appraisal">
      {/* <h6 className="header_AI_appraisal">Bunyaad AI Property Valuation</h6> */}

      <div className="container_AI_appraisal">
        <h2 className="title_AI_appraisal">AI Property Price Estimation</h2>

        <div className="form_AI_appraisal">
          {/* First Row */}
          <div className="form_row_AI_appraisal">
            <input type="text" placeholder="City" value={city_AI_appraisal} onChange={e => setCity_AI_appraisal(e.target.value)} />
            <input type="text" placeholder="Location" value={location_AI_appraisal} onChange={e => setLocation_AI_appraisal(e.target.value)} />
            <select value={houseType_AI_appraisal} onChange={e => setHouseType_AI_appraisal(e.target.value)}>
              <option>House</option>
              <option>Apartment</option>
              <option>Land</option>
              <option>Shop</option>
              <option>Office</option>
            </select>
          </div>

          {/* Second Row */}
          <div className="form_row_AI_appraisal">
            <select value={propertyType_AI_appraisal} onChange={e => setPropertyType_AI_appraisal(e.target.value)}>
              <option>Residential</option>
              <option>Commercial</option>
            </select>
            <input type="number" placeholder="Size" value={size_AI_appraisal} onChange={e => setSize_AI_appraisal(e.target.value)} />
            <select className="sizeUnit_AI_appraisal" value={sizeUnit_AI_appraisal} onChange={e => setSizeUnit_AI_appraisal(e.target.value)}>
              <option value="Marla">Marla</option>
              <option value="Kanal">Kanal</option>
              <option value="Sqft">Sqft</option>
              <option value="Sqyd">Sqyd</option>
              <option value="Sqm">Sqm</option>
              <option value="Yd²">Yd²</option>
              <option value="Ft.">Ft.</option>
              <option value="Ft²">Ft²</option>
              <option value="Yd">Yd</option>
              <option value="Yard">Yard</option>
            </select>
            <select className="transactionType_AI_appraisal" value={transactionType_AI_appraisal} onChange={e => setTransactionType_AI_appraisal(e.target.value)}>
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
            </select>
          </div>

          {/* Third Row */}
          <div className="form_row_AI_appraisal">
            <input type="number" placeholder="Rooms" value={rooms_AI_appraisal} onChange={e => setRooms_AI_appraisal(e.target.value)} />
            <input type="number" placeholder="Bathrooms" value={bathrooms_AI_appraisal} onChange={e => setBathrooms_AI_appraisal(e.target.value)} />
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
