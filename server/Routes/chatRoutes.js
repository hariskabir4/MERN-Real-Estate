const express = require('express');
const router = express.Router();
const Chat = require('../Models/Chat');

// Get all chats for a user
router.get('/users/:userId/chats', async (req, res) => {
    const { userId } = req.params;
    console.log('GET /users/:userId/chats - Fetching chats for user:', userId);

    try {
        const messages = await Chat.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).sort({ timestamp: -1 });

        // Get unique conversation partners
        const conversations = messages.reduce((acc, msg) => {
            const partnerId = msg.sender === userId ? msg.receiver : msg.sender;
            if (!acc.find(conv => conv.otherUser === partnerId)) {
                acc.push({
                    otherUser: partnerId,
                    lastMessage: msg.content,
                    lastMessageTime: msg.timestamp,
                    lastMessageSender: msg.sender
                });
            }
            return acc;
        }, []);

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

        res.status(200).json(messages);
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
        res.status(201).json(savedMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

module.exports = router;
