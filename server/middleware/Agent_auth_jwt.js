const jwt = require("jsonwebtoken");

const verifyAgentToken = (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.replace("Bearer ", "");
        console.log("Received Token:", token); // Debugging line

        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", verified); // Debugging line

        // Ensure the decoded token contains the expected fields
        if (!verified.agent_id || !verified.email || !verified.city) {
            return res.status(401).json({ error: "Invalid token payload" });
        }

        req.agent = {
            agent_id: verified.agent_id, // Store agent_id (MongoDB ObjectId)
            email: verified.email,
            city: verified.city, // Store city for filtering requests
        };

        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message); // Debugging line
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = { verifyAgentToken };
