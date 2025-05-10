import React, { useState } from 'react';
import { getEscrowContract, getPKRTokenContract } from '../utils/contracts';
import { ethers } from 'ethers';

const AcceptOfferModal = ({ isOpen, onClose, offer, propertyId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAccept = async () => {
        try {
            setLoading(true);
            setError('');

            // Prompt the owner to select their account
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const ownerAddress = accounts[0]; // Use the first selected account

            const pkrToken = await getPKRTokenContract();
            const escrow = await getEscrowContract();

            // Approve escrow contract to spend tokens
            const approveTx = await pkrToken.approve(escrow.target, offer.tokenAmount);
            await approveTx.wait();

            // Accept the offer and pass the ownerAddress
            const acceptTx = await escrow.acceptOffer(propertyId, offer.index, ownerAddress);
            await acceptTx.wait();

            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Accept Offer</h2>
                {error && <div className="error">{error}</div>}
                <div className="offer-details">
                    <p>Amount: {ethers.formatEther(offer.amount)} PKR</p>
                    <p>Buyer: {offer.buyer}</p>
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button onClick={handleAccept} disabled={loading}>
                        {loading ? 'Processing...' : 'Accept Offer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AcceptOfferModal;