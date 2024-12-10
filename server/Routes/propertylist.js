const express = require("express");
const router = express.Router();
const Residential = require("../Models/Residential");
const Commercial = require("../Models/Commercial");

// Property Listing Route (updated to /new-listing)
router.post("/new-listing", async (req, res) => {
    try {
        const { propertyType, title, owner, location, price, size, bedrooms, bathrooms, purpose, features } = req.body;

        // Validation checks
        if (!propertyType || !title || !owner || !location || !price || !size || !purpose) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!["Residential", "Commercial"].includes(propertyType)) {
            return res.status(400).json({ message: "Invalid property type" });
        }

        if (purpose !== "Sell" && purpose !== "Rent") {
            return res.status(400).json({ message: "Purpose must be 'Sell' or 'Rent'" });
        }

        if (propertyType === "Residential" && (!bedrooms || !bathrooms)) {
            return res.status(400).json({ message: "Bedrooms and Bathrooms are required for residential properties" });
        }

        // Save property to the database
        let property;
        if (propertyType === "Residential") {
            property = new Residential({
                title: title.trim(),
                owner: owner.trim(),
                location: location.trim(),
                price,
                size,
                bedrooms,
                bathrooms,
                purpose,
                features: features?.trim(),
            });
        } else {
            property = new Commercial({
                title: title.trim(),
                owner: owner.trim(),
                location: location.trim(),
                price,
                size,
                purpose,
                features: features?.trim(),
            });
        }

        await property.save();

        res.status(201).json({ message: "Property listed successfully", property });
    } catch (error) {
        console.error("Error in property listing:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
