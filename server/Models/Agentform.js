const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    issuingAuthority: { type: String, required: true },
    experience: { type: String, required: true },
    specialization: { type: [String], required: true },

    // Optional Fields
    companyName: { type: String, default: null },
    officeAddress: { type: String, default: null },
    website: { type: String, default: null },
    profilePicture: { type: String, default: null },
    licenseCopy: { type: String, default: null },
    businessLogo: { type: String, default: null },
    certifications: { type: [String], default: [] }
});

const Agent = mongoose.model("Agent", AgentSchema);
module.exports = Agent;