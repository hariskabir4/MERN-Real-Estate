const express = require("express");
const router = express.Router();
const Residential = require("../Models/Residential");
const Commercial = require("../Models/Commercial");
const multer = require("multer");
const path = require("path");

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // specify the directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // filename as current timestamp + file extension
    }
});

// Initialize multer with the storage engine
const upload = multer({ storage: storage }).array("images", 5); // Allow multiple file uploads, max 5 images

// Property Listing Route (updated to /new-listing)
router.post("/new-listing", upload, async (req, res) => {
    try {
        const { propertyType, title, owner, location, price, size, bedrooms, bathrooms, purpose, features, city, state, status } = req.body;

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

        // Handle file uploads (if any)
        const images = req.files ? req.files.map(file => file.filename) : [];

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
                city,
                state,
                status,
                images, // Save the image filenames in the db
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
                city,
                state,
                status,
                images, // Save the image filenames in the db
            });
        }

        console.log("Prepared property data for saving:", property);
        console.log("Prepared type:", propertyType);

        await property.save();
        res.status(201).json({ message: "Property listed successfully", property });
    } catch (error) {
        console.error("Error in property listing:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
