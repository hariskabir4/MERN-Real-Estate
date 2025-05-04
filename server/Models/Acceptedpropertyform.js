const mongoose = require("mongoose");

const acceptedPropertyFormSchema = new mongoose.Schema({
    agent_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Agent",
    },
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "OnsiteInspectionRequest", // or whatever your inspection request model is
    },
    inspectionDate: Date,
    locationPrice: String,
    propertyType: String,
    yearBuilt: Number,
    generalCondition: String,
    occupancyStatus: String,
    foundation: String,
    plumbingCondition: String,
    waterPressure: String,
    overallCondition: String,
    repairList: String,
    estimatedCosts: String,
    finalRemarks: String,
});

module.exports = mongoose.models.AcceptedPropertyForm || mongoose.model("AcceptedPropertyForm", acceptedPropertyFormSchema);
