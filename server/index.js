const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require('http');
require("dotenv").config();

const authRoutes = require("./Routes/auth"); // Import auth routes
const propertyRoutes = require("./Routes/propertylist"); // Import property routes
const searchRoutes = require("./Routes/searchproperty");
const propertyDetailsRoutes = require("./Routes/propertyDetails");
const topPropertiesRoutes = require("./Routes/topProperties");
const agentRoutes = require("./Routes/Agentroute");
const chatRoutes = require("./Routes/chatRoutes");
const offerRoutes = require('./Routes/offerRoutes');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configure CORS before any routes
app.use(cors({
    origin: "http://localhost:3000", // React app's URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Socket.IO setup with CORS
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Other middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/agent', agentRoutes);
app.use('/', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/properties/search', searchRoutes);
app.use('/api/property', propertyDetailsRoutes);
app.use('/api/properties/top', topPropertiesRoutes);
app.use('/api/offers', offerRoutes);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Proj", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB error:", err));

// Socket.io for real-time communication
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

        // Broadcast to all clients in the room INCLUDING sender
        io.in(room).emit('messageReceived', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    // Add error handling
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));