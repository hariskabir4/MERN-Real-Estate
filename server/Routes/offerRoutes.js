const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const authenticateToken = require('../middleware/jwtAuth');
const Residential = require('../Models/Residential');
const Commercial = require('../Models/Commercial');
const mongoose = require('mongoose');
const { Web3 } = require('web3'); // Correct import for web3@4.x.x
const EscrowArtifact = require('../../client/src/blockchain/abis/Escrow.json'); // Import the full artifact
const EscrowABI = EscrowArtifact.abi; // Extract only the ABI
const fs = require('fs');
const path = require('path');

// Load the Escrow contract address from config.json
const configPath = path.join(__dirname, '../../blockchain/config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const escrowAddress = config.escrowAddress;

// Initialize Web3 and the Escrow contract
const web3 = new Web3('http://localhost:8545'); // Connect to Ethereum node
const escrowContract = new web3.eth.Contract(EscrowABI, escrowAddress); // Use the dynamically loaded address

// Get all offers (protected, admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get offers for a specific property (only for property owner)
router.get('/property/:propertyId', authenticateToken, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.id;

    // Check if user owns the property
    let property = await Residential.findById(propertyId);
    if (!property) {
      property = await Commercial.findById(propertyId);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
    }

    // Verify ownership
    if (property.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Fetch offers for the property
    const offers = await Offer.find({ propertyId }).sort({ time: -1 });
    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error); 
    res.status(500).json({ message: 'Server error' });
  }
});

// Get offers made by the current user
router.get('/my-offers', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Searching for offers with buyerId:', userId);

    // Fetch offers for the current user
    const offers = await Offer.find({ buyerId: userId }).sort({ time: -1 });
    console.log('Found offers:', offers);

    // Fetch property details for each offer
    const offersWithDetails = await Promise.all(offers.map(async (offer) => {
      let property = await Residential.findById(offer.propertyId);
      if (!property) {
        property = await Commercial.findById(offer.propertyId);
      }
      console.log('Property found for offer:', property ? property._id : 'Not found');

      return {
        ...offer.toObject(),
        property: property ? {
          title: property.title,
          location: property.location,
          images: property.images,
          price: property.price,
          propertyId: property._id,
          type: property.constructor.modelName // property type
        } : null
      };
    }));

    console.log('Sending offers with details:', offersWithDetails);
    res.json(offersWithDetails);
  } catch (error) {
    console.error('Error fetching user offers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new offer
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { propertyId, buyerId, buyerName, offerAmount, tokenAmount, time } = req.body;

    const newOffer = new Offer({
      propertyId,
      buyerId,
      buyerName,
      offerAmount,
      tokenAmount,
      time,
    });

    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update offer status (accept/reject) - only for property owner
router.put('/:offerId/:action', authenticateToken, async (req, res) => {
    try {
        const { offerId, action } = req.params;
        const userId = req.user.id;

        const offer = await Offer.findById(offerId);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        // Verify property ownership
        let property = await Residential.findById(offer.propertyId);
        if (!property) {
            property = await Commercial.findById(offer.propertyId);
        }

        if (!property || property.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized: You do not own this property' });
        }

        if (action === 'accept') {
            offer.status = 'Accepted';
        } else if (action === 'reject') {
            offer.status = 'Rejected';
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await offer.save();
        res.json(offer);
    } catch (error) {
        console.error('Error updating offer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Accept Offer API
router.put('/:id/accept', authenticateToken, async (req, res) => {
  const { ownerAccount } = req.body; // Owner's account address
  const offerId = req.params.id;

  try {
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    // Check if the user is the property owner
    const property = await Residential.findById(offer.propertyId) || await Commercial.findById(offer.propertyId);
    if (!property || property.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Interact with the smart contract
    const propertyId = offer.propertyId;
    const offerIndex = await escrowContract.methods
      .propertyOffers(propertyId, 0) // Assuming the first offer is being accepted
      .call();

    await escrowContract.methods
      .acceptOffer(propertyId, offerIndex)
      .send({ from: ownerAccount });

    // Update offer status in the database
    offer.status = 'Accepted';
    offer.ownerAccount = ownerAccount;
    await offer.save();

    res.json(offer);
  } catch (error) {
    console.error('Error accepting offer:', error);
    res.status(500).json({ message: 'Failed to accept offer' });
  }
});

module.exports = router;