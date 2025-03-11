import React from "react";
import AgentNavbar from "./AgentNavbar";
import HeaderComponent from "./HeaderComponent";
import RealEstateCard from "./RealEstateCard";
import Footer from "./Footer";

const AgentDashboard = () => {
  return (
    <div>
      <AgentNavbar />
      <HeaderComponent />
      <div className="property-container">
        <RealEstateCard
          imageSrc="./source1.jpg"
          price="25256"
          type="Office for Sale"
          size="900"
          location="DHA Phase VI, Karachi, Pakistan"
          date="26.11.2024 - A DAY AGO"
        />
      </div>
      <Footer />
    </div>
  );
};

export default AgentDashboard;
