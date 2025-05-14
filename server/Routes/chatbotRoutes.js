const express = require('express');
const router = express.Router();
const ChatbotConversation = require('../Models/ChatbotConversation');
const authenticateToken = require('../middleware/jwtAuth');
const axios = require('axios');

// Get all conversations for a user
router.get('/conversations', authenticateToken, async (req, res) => {
    try {
        const conversations = await ChatbotConversation.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Error fetching conversations' });
    }
});

// Get a specific conversation
router.get('/conversations/:id', authenticateToken, async (req, res) => {
    try {
        const conversation = await ChatbotConversation.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        
        res.json(conversation);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ message: 'Error fetching conversation' });
    }
});

// Create a new conversation
router.post('/conversations', authenticateToken, async (req, res) => {
    try {
        const { title } = req.body;
        const newConversation = new ChatbotConversation({
            userId: req.user.id,
            title: title || 'New Chat',
            messages: []
        });
        
        await newConversation.save();
        res.status(201).json(newConversation);
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ message: 'Error creating conversation' });
    }
});

// Add a message to a conversation
router.post('/conversations/:id/messages', authenticateToken, async (req, res) => {
    try {
        const { prompt } = req.body;
        
        // Get response from Gemini API
        const response = await axios.post('http://0.0.0.0:6000/chat', { query: prompt });
        
        const conversation = await ChatbotConversation.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        
        conversation.messages.push({
            prompt,
            response: response.data.response,
            timestamp: new Date()
        });
        
        // If this is the first message, set the title to the prompt (trimmed)
        if (conversation.messages.length === 1) {
            conversation.title = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt;
        }
        
        await conversation.save();
        res.json(conversation);
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ message: 'Error adding message' });
    }
});

// Delete a conversation
router.delete('/conversations/:id', authenticateToken, async (req, res) => {
    try {
        const conversation = await ChatbotConversation.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        
        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ message: 'Error deleting conversation' });
    }
});

module.exports = router; 