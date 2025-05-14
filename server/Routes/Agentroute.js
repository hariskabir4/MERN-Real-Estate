const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Agent = require("../Models/Agentform");

const JWT_SECRET = "your_secret_key"; // Replace with a secure secret in .env

// Agent Signup Route
router.post("/signup", async (req, res) => {
    try {
        let {
            fullName, email, phoneNumber, password, confirmPassword, licenseNumber,
            issuingAuthority, experience, specialization, companyName, officeAddress,
            website, profilePicture, licenseCopy, businessLogo, certifications
        } = req.body;

        // Convert empty strings to null
        fullName = fullName?.trim() || null;
        email = email?.trim() || null;
        phoneNumber = phoneNumber?.trim() || null;
        password = password || null;
        confirmPassword = confirmPassword || null;
        licenseNumber = licenseNumber?.trim() || null;
        issuingAuthority = issuingAuthority?.trim() || null;
        experience = experience?.trim() || null;
        specialization = specialization && specialization.length > 0 ? specialization : null;
        companyName = companyName?.trim() || null;
        officeAddress = officeAddress?.trim() || null;
        website = website?.trim() || null;
        profilePicture = profilePicture || null;
        licenseCopy = licenseCopy || null;
        businessLogo = businessLogo || null;
        certifications = certifications && certifications.length > 0 ? certifications : [];

        console.log("Received request body:", req.body);

        // Validate required fields
        const missingFields = [];
        if (!fullName) missingFields.push("fullName");
        if (!email) missingFields.push("email");
        if (!phoneNumber) missingFields.push("phoneNumber");
        if (!password) missingFields.push("password");
        if (!confirmPassword) missingFields.push("confirmPassword");
        if (!licenseNumber) missingFields.push("licenseNumber");
        if (!issuingAuthority) missingFields.push("issuingAuthority");
        if (!experience) missingFields.push("experience");
        if (!specialization) missingFields.push("specialization");

        if (missingFields.length > 0) {
            console.log("Missing required fields:", missingFields);
            return res.status(400).json({ message: `All required fields must be filled: ${missingFields.join(", ")}` });
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
            companyName,
            officeAddress,
            website,
            profilePicture,
            licenseCopy,
            businessLogo,
            certifications
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