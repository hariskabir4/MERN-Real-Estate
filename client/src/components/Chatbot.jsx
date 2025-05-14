import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Use the same token key as MyOffers.jsx
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/chatbot/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/chatbot/conversations',
        { title: 'New Chat' },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setConversations([response.data, ...conversations]);
      setCurrentConversation(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !currentConversation) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/chatbot/conversations/${currentConversation._id}/messages`,
        { prompt: message },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update conversations list with the new message
      const updatedConversations = conversations.map(conv =>
        conv._id === currentConversation._id ? response.data : conv
      );
      setConversations(updatedConversations);
      setCurrentConversation(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot_container_chatbot_Bunyaad">
      <div className="sidebar_chatbot_Bunyaad">
        <button className="newchat_btn_chatbot_Bunyaad" onClick={handleNewChat}>
          + New Chat
        </button>
        <div className="chat_list_chatbot_Bunyaad">
          {conversations.map(conv => (
            <div
              key={conv._id}
              className={`chat_item_chatbot_Bunyaad ${conv._id === currentConversation?._id ? 'active_chatbot_Bunyaad' : ''}`}
              onClick={() => setCurrentConversation(conv)}
            >
              <div className="chat_title_chatbot_Bunyaad">
                {conv.title}
              </div>
              <div className="chat_time_chatbot_Bunyaad">
                {new Date(conv.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat_area_chatbot_Bunyaad">
        {currentConversation ? (
          <>
            <div className="messages_chatbot_Bunyaad">
              {currentConversation.messages.map((msg, index) => (
                <div key={index} className="message_block_chatbot_Bunyaad">
                  <div className="user_msg_chatbot_Bunyaad">{msg.prompt}</div>
                  <div className="bot_msg_chatbot_Bunyaad">{msg.response}</div>
                </div>
              ))}
            </div>
            <div className="input_area_chatbot_Bunyaad">
              <input
                type="text"
                className="input_chatbot_Bunyaad"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <button 
                className="send_btn_chatbot_Bunyaad" 
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        ) : (
          <div className="welcome_msg_chatbot_Bunyaad">
            Click on "New Chat" to start a conversation!
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
