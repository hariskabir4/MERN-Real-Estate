const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
});

// Compound index for faster querying of conversations between two users
chatSchema.index({ sender: 1, receiver: 1, timestamp: -1 });
chatSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Chat', chatSchema);