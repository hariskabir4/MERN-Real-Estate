const express = require("express");
const Residential = require("../Models/Residential");
const Commercial = require("../Models/Commercial");

const router = express.Router();

// Search and Filter API
router.get("/", async (req, res) => {
    const { query, category, location, purpose, features, city, state, status, price, bedrooms, bathrooms } = req.query;

    try {
        let queryObject = {};

        // Handle purpose filtering (Sell/Rent)
        if (category === "Sale" || category === "Rent") {
            queryObject.purpose = category;
        }

        // Handle keyword search (House, Land, Workplace in title)
        if (["House", "Land", "Workplace"].includes(category)) {
            queryObject.title = { $regex: category, $options: "i" };
        }

        // General keyword search
        if (query) {
            queryObject.$or = [
                { title: { $regex: query, $options: "i" } },
                { city: { $regex: query, $options: "i" } },
                { location: { $regex: query, $options: "i" } },
                { features: { $regex: query, $options: "i" } },
                { purpose: { $regex: query, $options: "i" } },
                { state: { $regex: query, $options: "i" } },
                { status: { $regex: query, $options: "i" } }
            ];
        }

        // Additional Filters
        if (location) queryObject.location = { $regex: location, $options: "i" };
        if (features) queryObject.features = { $regex: features, $options: "i" };
        if (city) queryObject.city = { $regex: city, $options: "i" };
        if (state) queryObject.state = { $regex: state, $options: "i" };
        if (status) queryObject.status = { $regex: status, $options: "i" };

        // Numeric Filters
        if (price) queryObject.price = { $lte: Number(price) };
        if (bedrooms) queryObject.bedrooms = Number(bedrooms);
        if (bathrooms) queryObject.bathrooms = Number(bathrooms);

        // Fetch properties with only required fields + owner name
        const residentialProperties = await Residential.find(queryObject)
            .select("title location price size bedrooms bathrooms city state images listedAt");
           

        const commercialProperties = await Commercial.find(queryObject)
            .populate("owner", "name")
            .select("title location price size bedrooms bathrooms city state images listedAt")

        // Combine results
        const properties = [...residentialProperties, ...commercialProperties];
        res.json(properties);

    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
