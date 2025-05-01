const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');

// Get all offers or offers for a specific propertyId (via query param)
router.get('/', async (req, res) => {
  const { propertyId } = req.query;
  let offers;
  if (propertyId) {
    offers = await Offer.find({ propertyId });
  } else {
    offers = await Offer.find();
  }
  res.json(offers);
});

// Get offers for a specific propertyId (via URL param)
router.get('/property/:propertyId', async (req, res) => {
  const { propertyId } = req.params;
  const offers = await Offer.find({ propertyId });
  res.json(offers);
});

// Add a new offer
router.post('/', async (req, res) => {
  const offer = new Offer(req.body);
  await offer.save();
  res.json(offer);
});

module.exports = router; 