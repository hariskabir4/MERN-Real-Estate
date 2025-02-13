// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const authRoutes = require("./Routes/auth"); 
// const propertyRoutes = require("./Routes/propertylist"); 
// const searchRoutes = require("./Routes/searchproperty"); // Import search routes

// const app = express(); // Moved this line to the correct position

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/Proj", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
// mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
// mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));

// // Use routes
// app.use("/", authRoutes);
// app.use("/api/properties", propertyRoutes); // Prefix API property routes
// app.use("/api/properties", searchRoutes);   // Search API now correctly prefixed

// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));




const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./Routes/auth");
const propertyRoutes = require("./Routes/propertylist");
const searchRoutes = require("./Routes/searchproperty");
const propertyDetailsRoutes = require("./Routes/Propertydetailsroute");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Proj", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
});
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));

// Use routes
app.use("/", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/properties/search", searchRoutes); // Changed from /api/properties to /api/search
app.use("/api/properties/details", propertyDetailsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
