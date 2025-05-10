import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getEscrowContract } from '../utils/contracts';
import AcceptOfferModal from './AcceptOfferModal';
import { useParams } from 'react-router-dom';

const OfferContainer = (props) => {
    // Use propertyId from props or from URL params
    const params = useParams();
    const propertyId = props.propertyId || params.propertyId;
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [numericPropertyId, setNumericPropertyId] = useState(null);

    // Defensive check for propertyId
    if (!propertyId) {
        return <div className="error-message">Invalid property. Please select a property to view offers.</div>;
    }

    // Fetch propertyId mapping from backend
    useEffect(() => {
        const fetchPropertyIdMap = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/property/property-id-map');
                const map = await response.json();
                console.log('PropertyId map:', map, 'Current propertyId:', propertyId, 'Numeric:', map[propertyId]);
                setNumericPropertyId(map[propertyId]);
            } catch (err) {
                setNumericPropertyId(null);
            }
        };
        fetchPropertyIdMap();
    }, [propertyId]);

    // Fetch offers from backend DB
    const fetchDbOffers = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/offers/property/${propertyId}`);
            if (!response.ok) throw new Error('Failed to fetch DB offers');
            const data = await response.json();
            return data.map(offer => ({
                ...offer,
                source: 'db'
            }));
        } catch (err) {
            console.error('Error fetching DB offers:', err);
            return [];
        }
    }, [propertyId]);

    // Fetch offers from blockchain
    const fetchBlockchainOffers = useCallback(async () => {
        try {
            // Replace with actual blockchain fetch logic
            return [];
        } catch (err) {
            console.error('Error fetching blockchain offers:', err);
            return [];
        }
    }, []);

    const loadOffers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [dbOffers, blockchainOffers] = await Promise.all([
                fetchDbOffers(),
                fetchBlockchainOffers()
            ]);

            setOffers([...blockchainOffers, ...dbOffers]);
        } catch (err) {
            setError('Failed to load offers');
        } finally {
            setLoading(false);
        }
    }, [fetchDbOffers, fetchBlockchainOffers]);

    useEffect(() => {
        if (numericPropertyId !== undefined) {
            loadOffers();
        }
    }, [loadOffers, numericPropertyId]);

    const handleAcceptClick = (offer) => {
        setSelectedOffer(offer);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedOffer(null);
        loadOffers(); // Reload offers after modal closes
    };

    if (loading) return <div>Loading offers...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

  return (
        <div className="offers-container">
            <h2>Offers</h2>
            {offers.length === 0 ? (
                <p>No offers yet</p>
            ) : (
                <div className="offers-list">
                    {offers.map((offer, index) => (
                        <div key={index} className="offer-card">
                            <p>Amount: {offer.amount} PKR</p>
                            <p>Buyer: {offer.buyer}</p>
                            <p>Source: {offer.source === 'blockchain' ? 'Blockchain' : 'Database'}</p>
                            {offer.status && <p>Status: {offer.status}</p>}
                            {offer.time && <p>Time: {offer.time}</p>}
                            <button onClick={() => handleAcceptClick(offer)}>
                                Accept Offer
    </button>
                        </div>
                    ))}
                </div>
            )}
            {selectedOffer && (
                <AcceptOfferModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    offer={selectedOffer}
                    propertyId={propertyId}
        />
            )}
    </div>
  );
};

export default OfferContainer;

