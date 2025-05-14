const express = require("express");
const router = express.Router();
const Residential = require("../Models/Residential");
const Commercial = require("../Models/Commercial");

router.get("/", async (req, res) => {
  try {
    // Fetch properties that have at least one image
    const residentialProperties = await Residential.find({ 
      status: "available",
      images: { $exists: true, $ne: [], $not: { $size: 0 } }  // Check for non-empty images array
    })
      .sort({ listedAt: -1 })
      .limit(3);

    const commercialProperties = await Commercial.find({ 
      status: "available",
      images: { $exists: true, $ne: [], $not: { $size: 0 } }  // Check for non-empty images array
    })
      .sort({ listedAt: -1 })
      .limit(3);

    // Combine and sort by date
    const allProperties = [...residentialProperties, ...commercialProperties]
      .sort((a, b) => b.listedAt - a.listedAt)
      .slice(0, 6);

    res.json(allProperties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties", error });
  }
});

module.exports = router; 