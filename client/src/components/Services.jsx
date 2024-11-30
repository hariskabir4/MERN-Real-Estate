import React from "react";
import "./Services.css";

const Services = () => {
  return (
    <div className="services-page">
      <header className="services-header">
        <h1>Our Services</h1>
        <p>Providing comprehensive real estate solutions tailored to your needs.</p>
      </header>

      <div className="services-container">
        {/* Service 1 */}
        <div className="service-card">
          <img src="./images/buying.jpg" alt="Buying Properties" />
          <h2>Property Buying</h2>
          <p>
            Explore a wide range of residential and commercial properties. Our experts help you find your dream home or business location.
          </p>
        </div>

        {/* Service 2 */}
        <div className="service-card">
          <img src="./images/selling.jpg" alt="Selling Properties" />
          <h2>Property Selling</h2>
          <p>
            Sell your property at the best market value. We handle marketing, negotiations, and documentation.
          </p>
        </div>

        {/* Service 3 */}
        <div className="service-card">
          <img src="./images/rental.jpg" alt="Rental Services" />
          <h2>Rental Services</h2>
          <p>
            Simplify the rental process for landlords and tenants. We ensure smooth transactions and reliable agreements.
          </p>
        </div>

        {/* Service 4 */}
        <div className="service-card">
          <img src="./images/valuation.jpg" alt="Property Valuation" />
          <h2>Property Valuation</h2>
          <p>
            Get accurate property appraisals with our expert valuation services, ensuring fair and transparent pricing.
          </p>
        </div>

        {/* Service 5 */}
        <div className="service-card">
          <img src="./images/auction.jpg" alt="Live Auctions" />
          <h2>Make an offer</h2>
          <p>
            Participate in live property auctions for exclusive deals and investment opportunities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
