import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const generateTitle = (text) => {
    return text.length > 20 ? text.substring(0, 20) + '...' : text || 'New Chat';
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      timestamp: new Date().toLocaleString(),
      messages: [],
    };
    setChats([newChat, ...chats]);
    setCurrentChat(newChat);
    setMessage('');
    setResponse('');
  };

  const handleSend = () => {
    if (!message.trim()) return;
    const newMessage = { prompt: message, reply: 'This is a sample response.' };
    const updatedChat = {
      ...currentChat,
      title: generateTitle(message),
      messages: [...currentChat.messages, newMessage],
    };
    setChats(chats.map(chat => (chat.id === currentChat.id ? updatedChat : chat)));
    setCurrentChat(updatedChat);
    setResponse(newMessage.reply);
    setMessage('');
  };

  return (
    <div className="chatbot_container_chatbot_Bunyaad">
      <div className="sidebar_chatbot_Bunyaad">
        <button className="newchat_btn_chatbot_Bunyaad" onClick={handleNewChat}>
          + New Chat
        </button>
        <div className="chat_list_chatbot_Bunyaad">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`chat_item_chatbot_Bunyaad ${chat.id === currentChat?.id ? 'active_chatbot_Bunyaad' : ''}`}
              onClick={() => setCurrentChat(chat)}
            >
              <div className="chat_title_chatbot_Bunyaad">{chat.title}</div>
              <div className="chat_time_chatbot_Bunyaad">{chat.timestamp}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat_area_chatbot_Bunyaad">
        {currentChat ? (
          <>
            <div className="messages_chatbot_Bunyaad">
              {currentChat.messages.map((msg, index) => (
                <div key={index} className="message_block_chatbot_Bunyaad">
                  <div className="user_msg_chatbot_Bunyaad">{msg.prompt}</div>
                  <div className="bot_msg_chatbot_Bunyaad">{msg.reply}</div>
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
              />
              <button className="send_btn_chatbot_Bunyaad" onClick={handleSend}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="welcome_msg_chatbot_Bunyaad">Click on "New Chat" to start!</div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
