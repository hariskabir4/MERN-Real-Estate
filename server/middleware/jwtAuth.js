//token with name
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]; // Get token from Authorization header

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
        req.user = decoded; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Invalid or expired token:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateToken;