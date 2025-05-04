const mongoose = require("mongoose");

const OnsiteInspectionRequestSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
    propertyType: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    city: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["Pending", "Accepted", "Rejected"], 
        default: "Pending" 
    },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null }, // Assigned agent
    rejectedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Agent" }], // Agents who rejected
    createdAt: { type: Date, default: Date.now }
});

// Check if the model already exists
const modelName = "OnsiteInspectionRequest";
let OnsiteInspectionRequest;

if (mongoose.models[modelName]) {
    OnsiteInspectionRequest = mongoose.model(modelName); // Reuse the existing model
} else {
    OnsiteInspectionRequest = mongoose.model(modelName, OnsiteInspectionRequestSchema); // Define the model if it doesn't exist
}

module.exports = OnsiteInspectionRequest;
