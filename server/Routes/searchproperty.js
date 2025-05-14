const express = require("express");
const Residential = require("../Models/Residential");
const Commercial = require("../Models/Commercial");

const router = express.Router();

// Search and Filter API
router.get("/", async (req, res) => {
    const { 
        query,      // Add this for search bar functionality
        category, 
        type, 
        state, 
        city, 
        minPrice, 
        maxPrice, 
        minSize, 
        maxSize 
    } = req.query;

    try {
        let queryObject = {};

        // Handle search query (restore previous search functionality)
        if (query) {
            queryObject.$or = [
                { title: { $regex: query, $options: "i" } },
                { city: { $regex: query, $options: "i" } },
                { location: { $regex: query, $options: "i" } },
                { features: { $regex: query, $options: "i" } },
                { state: { $regex: query, $options: "i" } }
            ];
        }

        // Handle purpose (Sale/Rent)
        if (category === "Sale" || category === "Rent") {
            queryObject.purpose = category === "Sale" ? "Sell" : "Rent";
        }

        // Location filters
        if (state) queryObject.state = state;
        if (city) queryObject.city = city;

        // Price range
        if (minPrice || maxPrice) {
            queryObject.price = {};
            if (minPrice) queryObject.price.$gte = Number(minPrice);
            if (maxPrice) queryObject.price.$lte = Number(maxPrice);
        }

        // Size range
        if (minSize || maxSize) {
            queryObject.size = {};
            if (minSize) queryObject.size.$gte = Number(minSize);
            if (maxSize) queryObject.size.$lte = Number(maxSize);
        }

        // Status should be available
        queryObject.status = "available";

        let properties = [];
        
        // Handle property type with improved Land type search
        if (type) {
            if (type === "Workplace") {
                properties = await Commercial.find(queryObject)
                    .select("title location price size city state images listedAt");
            } else if (type === "Housing") {
                properties = await Residential.find(queryObject)
                    .select("title location price size bedrooms bathrooms city state images listedAt");
            } else if (type === "Land") {
                // Search for land-related keywords in both collections
                const landQueryObject = {
                    ...queryObject,
                    $or: [
                        { title: { $regex: /land|plot|acre|kanal|marla/i } },
                        { description: { $regex: /land|plot|acre|kanal|marla/i } }
                    ]
                };
                
                const residentialLands = await Residential.find(landQueryObject)
                    .select("title location price size city state images listedAt");
                const commercialLands = await Commercial.find(landQueryObject)
                    .select("title location price size city state images listedAt");
                    
                properties = [...residentialLands, ...commercialLands];
            }
        } else {
            // If no type specified, search both collections
            const residentialProperties = await Residential.find(queryObject)
                .select("title location price size bedrooms bathrooms city state images listedAt");
            const commercialProperties = await Commercial.find(queryObject)
                .select("title location price size city state images listedAt");
            properties = [...residentialProperties, ...commercialProperties];
        }

        res.json(properties);

    } catch (error) {
        console.error("Error in filter search:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
