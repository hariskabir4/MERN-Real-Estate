const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const authenticateToken = require('../middleware/jwtAuth');
const Residential = require('../Models/Residential');
const Commercial = require('../Models/Commercial');
const mongoose = require('mongoose');

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
        }

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Verify ownership
        if (property.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized: You do not own this property' });
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
        
        // Use string comparison since buyerId is stored as string
        const offers = await Offer.find({ 
            buyerId: userId
        }).sort({ time: -1 });
        
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
                    type: property.constructor.modelName // Add property type
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
        const userId = req.user.id;
        const { name } = req.user;
        
        const offer = new Offer({
            ...req.body,
            buyerId: userId,
            buyerName: name,
            time: new Date(),
            status: 'Pending'
        });
        
        await offer.save();
        res.json(offer);
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

module.exports = router; 