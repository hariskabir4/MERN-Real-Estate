//token with name
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_super_secret_key";  // Use exact same secret

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        
        // Debug logging
        console.log("Auth header received:", authHeader);

        if (!authHeader) {
            return res.status(403).json({ message: "No authorization header" });
        }

        // Check for Bearer scheme
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Invalid authorization scheme" });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Debug logging
        console.log("Decoded token:", decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authenticateToken;