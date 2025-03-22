const Chat = require('../Models/Chat');

// Fetch chat history between two users
const getChatHistory = async (req, res) => {
    const { senderId, receiverId } = req.params;

    try {
        const messages = await Chat.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        }).sort({ timestamp: 1 }); // Sort messages by timestamp in ascending order

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
};

// Send a new message
const sendMessage = async (req, res) => {
    const { sender, receiver, content } = req.body;

    try {
        const newMessage = new Chat({
            sender,
            receiver,
            content,
            timestamp: new Date() // Explicitly set timestamp
        });

        const savedMessage = await newMessage.save();

        res.status(201).json(savedMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

module.exports = {
    getChatHistory,
    sendMessage,
};
