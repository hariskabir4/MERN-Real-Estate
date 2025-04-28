import React, { useState } from "react";
import { connectWallet } from "../blockchain/connectWallet";
import { Escrow, PKRToken } from "../blockchain/contractABIs";
import { EscrowAddress, PKRTokenAddress } from "../blockchain/contractAddresses";
import { ethers, parseUnits } from "ethers";
import "./MakeOfferGateway_make_offer_pg.css";
import { useParams } from "react-router-dom";

const MakeOfferGateway = ({ onOfferMade }) => {
  const { propertyId } = useParams();
  const [offerAmount, setOfferAmount] = useState("");
  const [status, setStatus] = useState("");
  const [account, setAccount] = useState("");

  // Always connect wallet fresh before transaction
  const handleConnect = async () => {
    const { address } = await connectWallet();
    setAccount(address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Connecting wallet...");
    try {
      const { signer, address } = await connectWallet();
      setAccount(address);
      const escrow = new ethers.Contract(EscrowAddress, Escrow.abi, signer);
      const pkrToken = new ethers.Contract(PKRTokenAddress, PKRToken.abi, signer);

      const tokenAmount = parseUnits((offerAmount * 0.01).toString(), 18);

      setStatus("Approving token transfer...");
      const approveTx = await pkrToken.approve(EscrowAddress, tokenAmount);
      await approveTx.wait();

      setStatus("Making offer...");
      const offerTx = await escrow.makeOffer(propertyId, parseUnits(offerAmount, 18), tokenAmount);
      await offerTx.wait();

      setStatus("Offer made successfully!");
      if (onOfferMade) onOfferMade();
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div className="make-offer-gateway_make_offer_pg">
      <h2 className="make-offer-title_make_offer_pg">Make an Offer</h2>
      <button onClick={handleConnect} style={{marginBottom: '10px'}}>Connect Wallet</button>
      {account && <div style={{marginBottom: '10px'}}>Connected: {account}</div>}
      <form onSubmit={handleSubmit} className="make-offer-form_make_offer_pg">
        <label htmlFor="offerAmount_make_offer_pg">Offer Amount (PKR):</label>
        <input
          id="offerAmount_make_offer_pg"
          type="number"
          value={offerAmount}
          onChange={e => setOfferAmount(e.target.value)}
          required
        />
        <button type="submit" className="submit-offer-btn_make_offer_pg">Submit Offer</button>
      </form>
      <div className="status_make_offer_pg">{status}</div>
    </div>
  );
};

export default MakeOfferGateway;