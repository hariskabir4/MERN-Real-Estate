const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./Routes/auth"); // Import auth routes
const propertyRoutes = require("./Routes/propertylist"); // Import property routes
const searchRoutes = require("./Routes/searchproperty");
const propertyDetailsRoutes = require("./Routes/propertyDetails");
const topPropertiesRoutes = require("./Routes/topProperties");
const agentRoutes = require("./Routes/Agentroute");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use("/api/agent", agentRoutes);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Proj", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));

// Use auth routes
app.use("/", authRoutes);

// Use property listing routes
app.use("/api/properties", propertyRoutes); // Prefix API property routes with `/api/properties`
app.use("/api/properties/search", searchRoutes);

// Add this new route
app.use("/api/property", propertyDetailsRoutes);

// Add this new route
app.use("/api/properties/top", topPropertiesRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));