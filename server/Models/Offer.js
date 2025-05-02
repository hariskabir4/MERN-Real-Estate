const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  propertyId: { 
    type: String,  // Keep as String for backward compatibility
    required: true 
  },
  buyerId: { 
    type: String,  // Keep as String for backward compatibility
    required: true 
  },
  buyerName: { type: String, required: true },
  offerAmount: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Accepted', 'Rejected'] },
  time: { type: String, required: true },  // Keep as String for backward compatibility
  tokenAmount: { type: String, required: true }
});

module.exports = mongoose.model('Offer', offerSchema); 