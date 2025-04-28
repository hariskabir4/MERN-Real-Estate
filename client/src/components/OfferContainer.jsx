import React, { useEffect, useState } from 'react';
import OfferCard from './OfferCard';
import './OfferContainer.css';
import { Escrow } from '../blockchain/contractABIs';
import { EscrowAddress } from '../blockchain/contractAddresses';
import { connectWallet } from '../blockchain/connectWallet';
import { ethers, formatUnits } from 'ethers';
import { useNavigate, useParams } from 'react-router-dom';

const OfferContainer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [account, setAccount] = useState("");
  const { propertyId } = useParams();
  const navigate = useNavigate();

  // Fetch offers from the Escrow contract
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const { provider, address } = await connectWallet();
        setAccount(address);
        const escrow = new ethers.Contract(EscrowAddress, Escrow.abi, provider);
        // Get offers for this propertyId
        const offersArr = await escrow.propertyOffers(propertyId);
        // offersArr is an array of structs: {buyer, amount, tokenAmount, refunded}
        // Map to displayable offers
        const formattedOffers = offersArr.map((offer, idx) => ({
          id: idx,
          propertyId: propertyId,
          buyerId: offer.buyer,
          buyerName: offer.buyer, // You can enhance this by mapping to user names if available
          offerAmount: formatUnits(offer.amount, 18),
          status: offer.refunded ? 'Refunded' : 'Pending',
          time: '', // Not available on-chain, could be added in contract if needed
          tokenAmount: formatUnits(offer.tokenAmount, 18),
        }));
        setOffers(formattedOffers);
      } catch (err) {
        setStatus('Error fetching offers: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    if (propertyId) fetchOffers();
  }, [propertyId]);

  // Accept offer (owner only)
  const handleAccept = async (offerIdx) => {
    setStatus('Accepting offer...');
    try {
      const { signer, address } = await connectWallet();
      setAccount(address);
      const escrow = new ethers.Contract(EscrowAddress, Escrow.abi, signer);
      const tx = await escrow.acceptOffer(propertyId, offerIdx);
      await tx.wait();
      setStatus('Offer accepted!');
      // Refresh offers
      window.location.reload();
    } catch (err) {
      setStatus('Error accepting offer: ' + err.message);
    }
  };

  // Reject offer (simulate by refunding, if needed)
  // In your contract, only non-accepted offers are refunded automatically on accept

  // Navigate to Make Offer Gateway
  const handleMakeOffer = () => {
    navigate(`/make-offer/${propertyId}`);
  };

  return (
    <div className="offer-container">
      <h5 className='heading-offer'>Total Offers Received</h5>
      {account && <div style={{marginBottom: '10px'}}>Connected: {account}</div>}
      <button className="container-reject-button" disabled>
        Reject All Offers
      </button>
      <button className="submit-offer-btn_make_offer_pg" style={{marginBottom: '16px'}} onClick={handleMakeOffer}>
        Make an Offer
      </button>
      {loading && <div>Loading offers...</div>}
      {status && <div style={{color: 'red'}}>{status}</div>}
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          propertyId={offer.propertyId}
          buyerId={offer.buyerId}
          buyerName={offer.buyerName}
          offerAmount={offer.offerAmount}
          status={offer.status}
          time={offer.time}
          tokenAmount={offer.tokenAmount}
          onAccept={() => handleAccept(offer.id)}
          onReject={() => {}}
        />
      ))}
    </div>
  );
};

export default OfferContainer;
