// require("dotenv").config(); // ✅ Load .env at the very top

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const authRoutes = require("./Routes/auth");
// const agenttoken = require("./Routes/Agent_token"); // adjust path
// const propertyRoutes = require("./Routes/propertylist");
// const searchRoutes = require("./Routes/searchproperty");
// const propertyDetailsRoutes = require("./Routes/propertyDetails");
// const topPropertiesRoutes = require("./Routes/topProperties");
// const agentRoutes = require("./Routes/Agentroute");
// const onsiteReqRoutes = require("./Routes/Onsite_req");
// const acceptedPropertyRoutes = require("./Routes/Agentacceptedproperty"); // ✅ Import the new route
// const ownerRoutes = require("./Routes/ownersreport"); // ✅ Import the owner reports route

// const app = express();

// // Debugging: Check if .env is loaded correctly
// console.log("🔹 Loaded JWT_SECRET:", process.env.JWT_SECRET || "❌ NOT LOADED");

// // Middleware
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
// }));
// app.use(bodyParser.json());
// app.use('/uploads', express.static('uploads'));
// app.use("/api/agent", agentRoutes);

// // Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/Proj", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("✅ Connected to MongoDB"))
//     .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // Routes
// app.use("/", authRoutes);

// app.use("/api", agenttoken);

// app.use("/api/properties", propertyRoutes);
// app.use("/api/properties/search", searchRoutes);
// app.use("/api/property", propertyDetailsRoutes);
// app.use("/api/properties/top", topPropertiesRoutes);
// app.use("/api/onsite-requests", onsiteReqRoutes);
// app.use("/api/agent/property_form", acceptedPropertyRoutes); // ✅ Add the accepted property route
// app.use("/api/owner", ownerRoutes); // ✅ Add the owner route for fetching requests and reports

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));













































require("dotenv").config(); // Load .env first

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

// Routes
const authRoutes = require("./Routes/auth");
const agenttoken = require("./Routes/Agent_token");
const propertyRoutes = require("./Routes/propertylist");
const searchRoutes = require("./Routes/searchproperty");
const propertyDetailsRoutes = require("./Routes/propertyDetails");
const topPropertiesRoutes = require("./Routes/topProperties");
const agentRoutes = require("./Routes/Agentroute");
const onsiteReqRoutes = require("./Routes/Onsite_req");
const acceptedPropertyRoutes = require("./Routes/Agentacceptedproperty");
const agentSubmittedReportsRoutes = require("./Routes/Agentsreport");
const ownerRoutes = require("./Routes/ownersreport");
const chatRoutes = require("./Routes/chatRoutes");
const offerRoutes = require('./Routes/offerRoutes');

const app = express();
const server = http.createServer(app);

// ✅ CORS configuration
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/Proj", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/agent', agenttoken);
app.use('/api/chat', chatRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/properties/search', searchRoutes);
app.use('/api/property', propertyDetailsRoutes);
app.use('/api/properties/top', topPropertiesRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/onsite-requests', onsiteReqRoutes);
app.use('/api/agent/property_form', acceptedPropertyRoutes);
app.use('/api/agent/reports', agentSubmittedReportsRoutes);
app.use('/api/owner', ownerRoutes);

// ✅ Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (room) => {
        if (room) {
            socket.join(room);
            console.log(`User ${socket.id} joined room: ${room}`);
        }
    });

    socket.on('sendMessage', (messageData) => {
        const { room, ...message } = messageData;
        console.log(`Sending message in room ${room}:`, message);
        io.in(room).emit('messageReceived', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
