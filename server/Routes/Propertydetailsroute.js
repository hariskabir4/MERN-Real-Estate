const express = require("express");
const router = express.Router();
const Residential = require("../Models/Residential");
const Commercial = require("../Models/Commercial");
const mongoose = require("mongoose");

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid property ID format" });
        }

        // Find in Residential first, if not found check Commercial
        const property = await Residential.findById(id) || await Commercial.findById(id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.json(property);
    } catch (err) {
        console.error("Error fetching property:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
