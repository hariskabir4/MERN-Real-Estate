const mongoose = require("mongoose");

const ResidentialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: Number, required: true },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  purpose: { type: String, enum: ["Sell", "Rent"], required: true },
  features: { type: String },
  listedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Residential", ResidentialSchema);
