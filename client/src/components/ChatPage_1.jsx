import React, { useState } from 'react';
import { FaSmile, FaPaperclip } from 'react-icons/fa';
import './ChatPage_1.css';

const ChatPage_1 = () => {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [message, setMessage] = useState('');

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
    setMessage(message + emoji); // Append emoji to the message
    setEmojiPickerVisible(false); // Hide the emoji picker after selection
  };

  return (
    <div className="chat-box">
      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="placeholder-icon">
                <circle cx="12" cy="8" r="4" />
                <path d="M12 14c-5 0-9 2-9 4.5V20h18v-1.5c0-2.5-4-4.5-9-4.5z" />
              </svg>
            </div>
            <h3>Alice</h3>
            <span className="user-status">Active Now</span>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>
          <div className="chat-categories">
            <button className="category">All</button>
            <button className="category active">Active Now</button>
          </div>
          <ul className="chat-list">
            <li className="chat-item">
              <div className="user-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="placeholder-icon">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 14c-5 0-9 2-9 4.5V20h18v-1.5c0-2.5-4-4.5-9-4.5z" />
                </svg>
              </div>
              <div className="chat-details">
                <h4>John Doe</h4>
                <p>Hey!</p>
              </div>
              <span className="chat-time">Now</span>
            </li>
            <li className="chat-item">
              <div className="user-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="placeholder-icon">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 14c-5 0-9 2-9 4.5V20h18v-1.5c0-2.5-4-4.5-9-4.5z" />
                </svg>
              </div>
              <div className="chat-details">
                <h4>Emma</h4>
                <p>Okay I will update you once the task is completed.</p>
              </div>
              <span className="chat-time">Now</span>
            </li>
          </ul>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          <div className="chat-header">
            <div className="user-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="placeholder-icon">
                <circle cx="12" cy="8" r="4" />
                <path d="M12 14c-5 0-9 2-9 4.5V20h18v-1.5c0-2.5-4-4.5-9-4.5z" />
              </svg>
            </div>
            <h3>John Doe</h3>
            <span className="user-status">Active Now</span>
          </div>
          <div className="chat-messages">
            <div className="message received">Hi, how are you doing?</div>
            <div className="message sent">I am doing great. How about you?</div>
            <div className="message sent">Please give me some time.</div>
            <div className="message received">Sure, take your time!</div>
          </div>
          <div className="chat-input">
            <div className="input-actions">
              <FaSmile className="emoji-icon" onClick={() => setEmojiPickerVisible(!emojiPickerVisible)} />
              <FaPaperclip className="attachment-icon" />
            </div>
            <input 
              type="text" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Type a message" 
            />
            <button className="send-button">Send</button>
          </div>
          {emojiPickerVisible && (
            <div className="emoji-picker">
              <span onClick={() => handleEmojiClick('😊')}>😊</span>
              <span onClick={() => handleEmojiClick('😂')}>😂</span>
              <span onClick={() => handleEmojiClick('😍')}>😍</span>
              <span onClick={() => handleEmojiClick('🥺')}>🥺</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage_1;
