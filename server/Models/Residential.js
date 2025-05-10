const mongoose = require("mongoose");

const ResidentialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  title: { type: String, required: true },
  owner: { type: String, required: true },
  ownerAddress: { type: String, required: true }, // Ethereum address of the owner
  location: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: Number, required: true },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  purpose: { type: String, enum: ["Sell", "Rent"], required: true },
  features: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  status: { type: String, enum: ["available", "sold", "rented"], required: true },
  images: [{ type: String }], // Array of image filenames
  listedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Residential || mongoose.model("Residential", ResidentialSchema);
