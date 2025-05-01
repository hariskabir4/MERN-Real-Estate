const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  propertyId: String,
  buyerId: String,
  buyerName: String,
  offerAmount: String,
  status: String,
  time: String,
  tokenAmount: String,
});

module.exports = mongoose.model('Offer', offerSchema); 