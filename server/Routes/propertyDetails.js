const express = require('express');
const router = express.Router();
const Commercial = require('../Models/Commercial');
const Residential = require('../Models/Residential');

// Get property details by ID
router.get('/:id', async (req, res) => {
    try {
        // Try to find in Commercial properties
        let property = await Commercial.findById(req.params.id);
        
        // If not found in Commercial, try Residential
        if (!property) {
            property = await Residential.findById(req.params.id);
        }

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Add a property type field to help frontend distinguish
        const propertyWithType = {
            ...property.toObject(),
            propertyType: property.constructor.modelName
        };

        res.json(propertyWithType);
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 