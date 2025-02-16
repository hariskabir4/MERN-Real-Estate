const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Agent = require("../models/Agentform");

const JWT_SECRET = "your_secret_key"; // Replace with a secure secret in .env

// Agent Signup Route
router.post("/signup", async (req, res) => {
    try {
        const {
            fullName, email, phoneNumber, password, confirmPassword, licenseNumber,
            issuingAuthority, experience, specialization, companyName, officeAddress,
            website, profilePicture, licenseCopy, businessLogo, certifications
        } = req.body;

        // Validation checks
        if (!fullName || !email || !phoneNumber || !password || !confirmPassword || !licenseNumber || !issuingAuthority || !experience || !specialization) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        if (password.length < 5) {
            return res.status(400).json({ message: "Password must be at least 5 characters long" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check if agent already exists
        const existingAgent = await Agent.findOne({ email });
        if (existingAgent) {
            return res.status(400).json({ message: "Agent with this email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new agent
        const newAgent = new Agent({
            fullName,
            email: email.trim().toLowerCase(),
            phoneNumber,
            password: hashedPassword,
            licenseNumber,
            issuingAuthority,
            experience,
            specialization,
            companyName: companyName || null,
            officeAddress: officeAddress || null,
            website: website || null,
            profilePicture,
            licenseCopy: licenseCopy || null,
            businessLogo: businessLogo || null,
            certifications: certifications || null
        });

        await newAgent.save();

        res.status(201).json({ message: "Agent registered successfully" });
    } catch (error) {
        console.error("Error in agent signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Agent Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const agent = await Agent.findOne({ email });
        if (!agent) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, agent.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: agent._id, email: agent.email }, JWT_SECRET, {
            expiresIn: "7d"
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error in agent login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
