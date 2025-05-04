

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const OnsiteInspectionRequest = require("../Models/Onsite_req_form");
const AcceptedPropertyForm = require("../Models/Acceptedpropertyform");

const authenticateToken = require("../middleware/jwtAuth"); // Owner authentication middleware
const { verifyAgentToken } = require("../middleware/Agent_auth_jwt"); // Agent authentication middleware

// ✅ Owner submits a request (Stored in DB)
router.post("/create", authenticateToken, async (req, res) => {
    try {
        const { propertyType, address, phoneNumber, city } = req.body;
        const ownerId = req.user.ownerId;

        const newRequest = new OnsiteInspectionRequest({
            ownerId,
            propertyType,
            address,
            phoneNumber,
            city,
            status: "Pending",
            rejectedBy: []
        });

        await newRequest.save();
        res.status(201).json({ message: "Request submitted successfully", request: newRequest });
    } catch (error) {
        console.error("Error creating request:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Get pending requests for an agent (Filtered by city & not yet accepted)
router.get("/pending", verifyAgentToken, async (req, res) => {
    try {
        const agent_city = req.agent.city;
        const agent_id = req.agent.agent_id;

        const requests = await OnsiteInspectionRequest.find({
            city: agent_city,
            status: "Pending",
            rejectedBy: { $ne: agent_id }
        });

        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Accept a request and initialize accepted property form
router.post("/accept/:requestId", verifyAgentToken, async (req, res) => {
    try {
        const agent_id = req.agent.agent_id;
        const { requestId } = req.params;

        const request = await OnsiteInspectionRequest.findById(requestId);
        if (!request) return res.status(404).json({ error: "Request not found" });

        if (request.status !== "Pending") {
            return res.status(400).json({ error: "Request already accepted or rejected" });
        }

        // Update the request
        request.agentId = agent_id;
        request.status = "Accepted";
        await request.save();

        // Create a new AcceptedPropertyForm entry with requestId
        const acceptedForm = new AcceptedPropertyForm({
            agent_id: agent_id,
            requestId: request._id,
            propertyType: request.propertyType
            // Other fields will be filled by agent later
        });

        await acceptedForm.save();

        res.json({
            message: "Request accepted successfully and inspection form initialized",
            request,
            acceptedForm
        });
    } catch (error) {
        console.error("Error accepting request:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Reject a request
router.post("/reject/:requestId", verifyAgentToken, async (req, res) => {
    try {
        const agent_id = req.agent.agent_id;
        const { requestId } = req.params;

        const request = await OnsiteInspectionRequest.findById(requestId);
        if (!request) return res.status(404).json({ error: "Request not found" });

        if (!request.rejectedBy.includes(agent_id)) {
            request.rejectedBy.push(agent_id);
            await request.save();
        }

        res.json({ message: "Request rejected successfully", request });
    } catch (error) {
        console.error("Error rejecting request:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
