const mongoose = require("mongoose");

const CommercialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: Number, required: true },
  purpose: { type: String, enum: ["Sell", "Rent"], required: true },
  features: { type: String },
  listedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Commercial", CommercialSchema);
