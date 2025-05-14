const express = require("express");
const router = express.Router();
const User = require("../models/Userschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/jwtAuth"); // Middleware for protected routes

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// ✅ **Signup Route**
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // **Validation**
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 5) {
      return res.status(400).json({ message: "Password must be at least 5 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // **Convert email to lowercase before checking in the database**
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // **Hash password before storing**
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // **Create new user**
    const newUser = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ **Login Route**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // **Convert email to lowercase for consistency**
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // **Compare password**
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // **Generate JWT including the user ID as ownerId**
    const token = jwt.sign(
      { ownerId: user._id, email: user.email, name: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ **Send the token and user details in the response**
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        ownerId: user._id, // ✅ Ensure `ownerId` is sent in response
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ **Protected Route: New Listing**
router.post("/new-listing", authenticateToken, async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Ensure user ID (ownerId) from token is used correctly
    const ownerId = req.user.ownerId;

    // Example logic to save listing (you need a Listing model)
    // const newListing = new Listing({
    //   title,
    //   description,
    //   price,
    //   ownerId, // ✅ Attach the owner's ID
    // });
    // await newListing.save();

    res.status(201).json({ message: "New listing created successfully", ownerId });
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
