// const mongoose = require("mongoose");

// const CommercialSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   owner: { type: String, required: true },
//   location: { type: String, required: true },
//   price: { type: Number, required: true },
//   size: { type: Number, required: true },
//   purpose: { type: String, enum: ["Sell", "Rent"], required: true },
//   features: { type: String },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   status: { type: String, enum: ["available", "sold", "rented"], required: true },
//   images: [{ type: String }], // Array of image filenames
//   listedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Commercial", CommercialSchema);




const mongoose = require("mongoose");

const CommercialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: Number, required: true },
  purpose: { type: String, enum: ["Sell", "Rent"], required: true },
  features: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  status: { type: String, enum: ["available", "sold", "rented"], required: true },
  images: [{ type: String }], // Array of image filenames
  listedAt: { type: Date, default: Date.now },
});

// Check if the model already exists in mongoose.models
const Commercial = mongoose.models.Commercial || mongoose.model("Commercial", CommercialSchema);

module.exports = Commercial;
