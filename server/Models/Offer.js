const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  propertyId: { type: String, required: true },
  offerAmount: { type: String, required: true },
  tokenAmount: { type: String, required: true },
  buyerId: { type: String, required: true },
  status: { type: String, default: 'pending' },
  time: { type: Date, default: Date.now }
});

// Prevent OverwriteModelError
module.exports = mongoose.models.Offer || mongoose.model('Offer', OfferSchema);