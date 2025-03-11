// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const authRoutes = require("./Routes/auth");
// const propertyRoutes = require("./Routes/propertylist");
// const searchRoutes = require("./Routes/searchproperty");
// const propertyDetailsRoutes = require("./Routes/Propertydetailsroute");
// const agentRoutes = require("./Routes/Agentroute"); // ✅ Updated Agent Routes

// const app = express();

// // Middleware
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(express.json()); // ✅ Parses JSON data
// app.use(express.urlencoded({ extended: true })); // ✅ Parses URL-encoded data
// app.use("/uploads", express.static("uploads")); // ✅ Serves static files from 'uploads'

// // Debugging Middleware to log incoming requests
// app.use((req, res, next) => {
//     console.log(`➡️  ${req.method} ${req.url}`);
//     console.log("Received Request Body:", req.body);
//     next();
// });

// // Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/Proj", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => console.log("✅ Connected to MongoDB"))
//   .catch(err => console.error("❌ MongoDB connection error:", err));

// // Use routes
// app.use("/", authRoutes);
// app.use("/api/properties", propertyRoutes);
// app.use("/api/properties/search", searchRoutes);
// app.use("/api/properties/details", propertyDetailsRoutes);
// app.use("/api/agent", agentRoutes); // ✅ Includes Login

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));











const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./Routes/auth");
const propertyRoutes = require("./Routes/propertylist");
const searchRoutes = require("./Routes/searchproperty");
const propertyDetailsRoutes = require("./Routes/Propertydetailsroute");
const agentRoutes = require("./Routes/Agentroute");
const propertyReportRoutes = require("./Routes/propertyreportroute"); // ✅ New Route Added

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json()); // ✅ Parses JSON data
app.use(express.urlencoded({ extended: true })); // ✅ Parses URL-encoded data
app.use("/uploads", express.static("uploads")); // ✅ Serves static files from 'uploads'

// Debugging Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`➡️  ${req.method} ${req.url}`);
    console.log("Received Request Body:", req.body);
    next();
});

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Proj", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Use routes
app.use("/", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/properties/search", searchRoutes);
app.use("/api/properties/details", propertyDetailsRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/property-reports", propertyReportRoutes); // ✅ New Route for Property Reports

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
