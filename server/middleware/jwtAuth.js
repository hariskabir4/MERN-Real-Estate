const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("🚀 Middleware Reached. Checking Token...");
    
    if (!authHeader) {
        console.log("❌ No Authorization header found");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        console.log("❌ Token is missing after split");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const secret = process.env.JWT_SECRET;
        console.log("🔹 Loaded JWT_SECRET:", secret ? "✅ Loaded" : "❌ NOT LOADED");

        if (!secret) {
            return res.status(500).json({ message: "Server error: Missing JWT secret" });
        }

        const decoded = jwt.verify(token, secret);
        console.log("✅ Token Verified Successfully:", decoded);

        // ✅ Make sure req.user is an object before setting properties
        req.user = { ownerId: decoded.ownerId, email: decoded.email, name: decoded.name };

        next();
    } catch (error) {
        console.error("❌ Token Verification Failed:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateToken;
