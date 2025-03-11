const mongoose = require("mongoose");

// Define Property Report Schema
const propertyReportSchema = new mongoose.Schema({
    inspectionDate: { type: Date, required: true },
    locationPrice: { type: String },
    propertyType: { type: String, required: true },
    yearBuilt: { type: Number },
    generalCondition: { type: String },
    occupancyStatus: { type: String },
    foundation: { type: String },
    plumbingCondition: { type: String },
    waterPressure: { type: String },
    kitchenCondition: { type: String },
    bathroomCondition: { type: String },
    overallCondition: { type: String },
    repairList: { type: String },
    estimatedCosts: { type: String },
    finalRemarks: { type: String },
}, { timestamps: true });

// Create and export model
const PropertyReport = mongoose.model("PropertyReport", propertyReportSchema);
module.exports = PropertyReport;
