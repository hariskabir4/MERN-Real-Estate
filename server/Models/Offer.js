const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  propertyId: { 
    type: String,  
    required: true 
  },
  buyerId: { 
    type: String,  
    required: true 
  },
  buyerName: { type: String, required: true },
  offerAmount: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Accepted', 'Rejected'] },
  time: { type: String, required: true },
  tokenAmount: { type: String, required: true },
  ownerAccount: { type: String } // New field to store owner's account address
});

module.exports = mongoose.model('Offer', offerSchema);