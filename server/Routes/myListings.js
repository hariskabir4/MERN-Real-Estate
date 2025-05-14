const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Residential = require('../Models/Residential');
const Commercial = require('../Models/Commercial');

// Get user's listings
router.get('/my-listings', auth, async (req, res) => {
  try {
    // Fetch both residential and commercial properties for the user
    const residentialListings = await Residential.find({ userId: req.user.id });
    const commercialListings = await Commercial.find({ userId: req.user.id });

    // Combine and sort by listing date
    const allListings = [...residentialListings, ...commercialListings]
      .sort((a, b) => b.listedAt - a.listedAt);

    res.json(allListings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 