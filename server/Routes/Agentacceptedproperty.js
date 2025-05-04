

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const AcceptedPropertyForm = require("../Models/Acceptedpropertyform");
const { verifyAgentToken } = require("../middleware/Agent_auth_jwt");

// POST: Submit an onsite appraisal form
router.post("/accepted_property_form", verifyAgentToken, async (req, res) => {
    try {
        const agent_id = req.agent.agent_id; // Extracted from token
        const {
            requestId,
            propertyType,
            inspectionDate,
            locationPrice,
            yearBuilt,
            generalCondition,
            occupancyStatus,
            foundation,
            plumbingCondition,
            waterPressure,
            overallCondition,
            repairList,
            estimatedCosts,
            finalRemarks,
        } = req.body;

        // Validate that the requestId is passed (requestId is the ObjectId from owner's request)
        if (!requestId) {
            return res.status(400).json({ error: "requestId is required" });
        }

        // ⭐ Convert requestId to ObjectId
        const objectIdRequestId = new mongoose.Types.ObjectId(requestId);

        // Create a new AcceptedPropertyForm with the extracted data
        const newForm = new AcceptedPropertyForm({
            agent_id,
            requestId: objectIdRequestId,  // Ensure requestId is stored as the ObjectId from the request
            propertyType,
            inspectionDate,
            locationPrice,
            yearBuilt,
            generalCondition,
            occupancyStatus,
            foundation,
            plumbingCondition,
            waterPressure,
            overallCondition,
            repairList,
            estimatedCosts,
            finalRemarks,
        });

        // Save the form
        await newForm.save();
        res.status(201).json({ message: "Form submitted successfully", data: newForm });
    } catch (error) {
        console.error("Error saving form:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
