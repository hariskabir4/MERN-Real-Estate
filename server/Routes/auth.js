
// const express = require("express");
// const router = express.Router();
// const User = require("../models/Userschema");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const authenticateToken = require("../middleware/jwtAuth"); // Import middleware

// // JWT Secret
// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// // Signup Route
// router.post("/signup", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Validation checks
//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password.length < 5) {
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 5 characters long" });
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email address" });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "User with this email already exists" });
//     }

//     // Hash password before saving to the database
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({
//       username: username.trim(),
//       email: email.trim().toLowerCase(),
//       password: hashedPassword,
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Error in signup:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Login Route
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validation checks
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Compare password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Generate JWT
//     const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
//       expiresIn: "1h", // Token expires in 1 hour
//     });

//     res.status(200).json({ message: "Login successful", token });
//   } catch (error) {
//     console.error("Error in login:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Protected Route
// // router.get("/protected", authenticateToken, (req, res) => {
// //   res.status(200).json({
// //     message: "Welcome to the protected route!",
// //     user: req.user, // Info from the decoded JWT
// //   }
// // );
// // }

// // Assuming that authenticateToken is the middleware to verify JWT
// router.post("/new-listing", authenticateToken, (req, res) => {
//   // If the user is logged in and the token is valid, proceed with creating the listing
//   // Your logic for creating a new listing here (e.g., saving it to the database)

//   res.status(200).json({ message: "New listing created successfully" });
// })
// ;

// module.exports = router;









// token with name
const express = require("express");
const router = express.Router();
const User = require("../models/Userschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/jwtAuth"); // Import middleware

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation checks
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "Password must be at least 5 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
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

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation checks
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT including username
    const token = jwt.sign({ id: user._id, email: user.email, name: user.username }, JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected Route
router.post("/new-listing", authenticateToken, (req, res) => {
  // If the user is logged in and the token is valid, proceed with creating the listing
  // Your logic for creating a new listing here (e.g., saving it to the database)

  res.status(200).json({ message: "New listing created successfully" });
});

module.exports = router;
