const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require('http');
const axios = require('axios');
const path = require('path');
require("dotenv").config();

const authRoutes = require("./Routes/auth"); // Import auth routes
const propertyRoutes = require("./Routes/propertylist"); // Import property routes
const searchRoutes = require("./Routes/searchproperty");
const propertyDetailsRoutes = require("./Routes/propertyDetails");
const topPropertiesRoutes = require("./Routes/topProperties");
const agentRoutes = require("./Routes/Agentroute");
const chatRoutes = require("./Routes/chatRoutes");
const offerRoutes = require('./Routes/offerRoutes');
const devRoutes = require('./Routes/dev');
const { Server } = require('socket.io');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000; // Backend server port
const HARDHAT_RPC_URL = "http://127.0.0.1:8545"; // Hardhat node URL
const HARDHAT_PROJECT_DIR = path.join(__dirname, '../blockchain'); // Path to Hardhat project

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
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/properties/search', searchRoutes);
app.use('/api/property', propertyDetailsRoutes);
app.use('/api/properties/top', topPropertiesRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/dev', devRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Proj', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to MongoDB");

        // Start the backend server
        server.listen(PORT, async () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log('Waiting for Hardhat node to start...');

            // Wait for Hardhat node to become available
            await waitForHardhatNode();

            // Deploy contracts
            console.log('Deploying contracts...');
            try {
                await deployContracts();
            } catch (error) {
                console.error('Error deploying contracts:', error.message);
                return; // Stop further execution if deployment fails
            }

            // Trigger offer sync
            console.log('Triggering offer sync...');
            axios.post('http://localhost:5000/api/dev/sync-offers-to-chain')
                .then(response => {
                    console.log('Offer sync result:', response.data);
                })
                .catch(error => {
                    console.error('Error syncing offers:', error.message);
                });
        });
    })
    .catch((err) => console.error("MongoDB error:", err));

// Function to wait for Hardhat node to start
async function waitForHardhatNode() {
    while (true) {
        try {
            await axios.post(HARDHAT_RPC_URL, {
                jsonrpc: "2.0",
                method: "web3_clientVersion",
                params: [],
                id: 1
            });
            console.log('Hardhat node is running!');
            break;
        } catch (err) {
            console.log('Waiting for Hardhat node...');
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
        }
    }
}

// Function to deploy contracts
async function deployContracts() {
    return new Promise((resolve, reject) => {
        exec('npx hardhat run scripts/deploy.js --network localhost', { cwd: HARDHAT_PROJECT_DIR }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error deploying contracts: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`Deployment stderr: ${stderr}`);
            }
            console.log(`Deployment stdout: ${stdout}`);
            resolve();
        });
    });
}

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