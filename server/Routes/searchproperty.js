// routes/search.js
const express = require('express');
const Residential = require('../models/Residential');  // Import Residential model
const Commercial = require('../models/Commercial');    // Import Commercial model

const router = express.Router();

// Search and Filter API
router.get('/properties/search', async (req, res) => {
    const { query, category } = req.query; // Get query and category from URL parameters

    try {
        // Create an empty query object
        let queryObject = {};

        // Add search term filter if query is provided
        if (query) {
            queryObject.$or = [
                { title: { $regex: query, $options: 'i' } },
                { city: { $regex: query, $options: 'i' } },
            ];
        }

        // Add category filter if category is provided
        if (category) {
            queryObject.category = category;
        }

        // Query both Residential and Commercial models based on the filters
        const residentialProperties = await Residential.find(queryObject);
        const commercialProperties = await Commercial.find(queryObject);

        // Combine results from both models
        const properties = [...residentialProperties, ...commercialProperties];

        // Return the combined results as JSON
        res.json(properties);
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
