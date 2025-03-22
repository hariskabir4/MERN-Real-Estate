const express = require('express');
const router = express.Router();
const Chat = require('../Models/Chat');
const User = require("../models/Userschema");

// Get all chats for a user
router.get('/users/:userId/chats', async (req, res) => {
    const { userId } = req.params;
    console.log('GET /users/:userId/chats - Fetching chats for user:', userId);

    try {
        const messages = await Chat.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).sort({ timestamp: -1 });

        // Get unique conversation partners and their usernames
        const conversations = [];
        for (const msg of messages) {
            const partnerId = msg.sender === userId ? msg.receiver : msg.sender;
            if (!conversations.find(conv => conv.otherUser === partnerId)) {
                // Fetch username for the partner
                let partnerUser;
                try {
                    partnerUser = await User.findById(partnerId);
                } catch (err) {
                    console.error('Error fetching partner user:', err);
                }

                conversations.push({
                    otherUser: partnerId,
                    otherUserName: partnerUser ? partnerUser.username : 'Unknown User',
                    lastMessage: msg.content,
                    lastMessageTime: msg.timestamp,
                    lastMessageSender: msg.sender
                });
            }
        }

        console.log('Sending conversations:', conversations);
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error fetching user chats:', error);
        res.status(500).json({ error: 'Failed to fetch user chats' });
    }
});

// Fetch messages between two users
router.get('/messages/:user1Id/:user2Id', async (req, res) => {
    const { user1Id, user2Id } = req.params;
    console.log('GET /messages/:user1Id/:user2Id - Fetching messages between users:', user1Id, user2Id);

    try {
        const messages = await Chat.find({
            $or: [
                { sender: user1Id, receiver: user2Id },
                { sender: user2Id, receiver: user1Id },
            ],
        }).sort({ timestamp: 1 });

        // Fetch usernames for both users
        const [user1, user2] = await Promise.all([
            User.findById(user1Id),
            User.findById(user2Id)
        ]);

        const messagesWithUsernames = messages.map(msg => ({
            ...msg.toObject(),
            senderName: msg.sender === user1Id ? user1?.username : user2?.username,
            receiverName: msg.receiver === user1Id ? user1?.username : user2?.username
        }));

        res.status(200).json(messagesWithUsernames);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Send a new message
router.post('/messages', async (req, res) => {
    const { sender, receiver, content } = req.body;
    console.log('POST /messages - New message:', { sender, receiver, content });

    try {
        const newMessage = new Chat({
            sender,
            receiver,
            content,
            timestamp: new Date()
        });

        const savedMessage = await newMessage.save();

        // Fetch sender and receiver usernames
        const [senderUser, receiverUser] = await Promise.all([
            User.findById(sender),
            User.findById(receiver)
        ]);

        const messageWithUsernames = {
            ...savedMessage.toObject(),
            senderName: senderUser?.username || 'Unknown User',
            receiverName: receiverUser?.username || 'Unknown User'
        };

        res.status(201).json(messageWithUsernames);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Get user info
router.get('/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ name: user.username });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

module.exports = router;
