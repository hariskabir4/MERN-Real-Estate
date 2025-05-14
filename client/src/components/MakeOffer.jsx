import React, { useState } from 'react';
import './MakeOffer.css';

const MakeOffer = () => {
  const [buyerName, setBuyerName] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you can process the form submission (e.g., API call)
    console.log({
      buyerName,
      offerAmount,
      tokenAmount,
      message
    });

    // Reset the form
    setBuyerName('');
    setOfferAmount('');
    setTokenAmount('');
    setMessage('');
  };

  return (
    <div className="make-offer-container">
      <div className="make-offer-box">
        <h2>Make an Offer</h2>
        <form onSubmit={handleSubmit} className="make-offer-form">
          <div className="form-field">
            <label htmlFor="buyerName">Your Name</label>
            <input
              type="text"
              id="buyerName"
              name="buyerName"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="offerAmount">Offer Amount</label>
            <input
              type="number"
              id="offerAmount"
              name="offerAmount"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="tokenAmount">Token Amount</label>
            <input
              type="number"
              id="tokenAmount"
              name="tokenAmount"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="message">Message (Optional)</label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn">Submit Offer</button>
        </form>
      </div>
    </div>
  );
};

export default MakeOffer;
