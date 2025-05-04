const express = require("express");
const router = express.Router();
const AcceptedPropertyForm = require("../models/AcceptedPropertyForm");
const { verifyAgentToken } = require("../middleware/Agent_auth_jwt");

router.get("/my-submitted-reports", verifyAgentToken, async (req, res) => {
  try {
    const agentId = req.agent.agent_id;

    const reports = await AcceptedPropertyForm.find({ agent_id: agentId });

    res.json(reports);
  } catch (error) {
    console.error("Error fetching agent reports:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
