// routes/agent.js
const express = require("express");
const router = express.Router();
const { verifyAgentToken } = require("../middleware/Agent_auth_jwt");
const Agent = require("../models/Agentform"); // adjust path if needed

// GET /api/agent-details
router.get("/agent-details", verifyAgentToken, async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent.agent_id).select("name email city");
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    res.json(agent); // Return name, email, city
  } catch (err) {
    console.error("Agent details fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
