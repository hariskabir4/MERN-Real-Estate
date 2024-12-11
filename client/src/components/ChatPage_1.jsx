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
    <div className="chat-box_chat">
      <div className="chat-container_chat">
        {/* Sidebar */}
        <div className="chat-sidebar_chat">
          <div className="user-info_chat">
            <div className="user-avatar_chat">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="placeholder-icon_chat">
                <circle cx="12" cy="8" r="4" />
                <path d="M12 14c-5 0-9 2-9 4.5V20h18v-1.5c0-2.5-4-4.5-9-4.5z" />
              </svg>
            </div>
            <h3>Alice</h3>
            <span className="user-status_chat">Active Now</span>
          </div>
          <div className="search-bar_chat">
            <input type="text" placeholder="Search" />
          </div>
          <div className="chat-categories_chat">
            <button className="category_chat">All</button>
            <button className="category_chat active_chat">Active Now</button>
          </div>
          <ul className="chat-list_chat">
            <li className="chat-item_chat">
              <div className="user-avatar_chat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="placeholder-icon_chat">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 14c-5 0-9 2-9 4.5V20h18v-1.5c0-2.5-4-4.5-9-4.5z" />
                </svg>
              </div>
              <div className="chat-details_chat">
                <h4>John Doe</h4>
                <p>Hey!</p>
              </div>
              <span className="chat-time_chat">Now</span>
            </li>
            <li className="chat-item_chat">
              <div className="user-avatar_chat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="placeholder-icon_chat">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 14c-5 0-9 2-9 4.5V20h18v-1.5c0-2.5-4-4.5-9-4.5z" />
                </svg>
              </div>
              <div className="chat-details_chat">
                <h4>Emma</h4>
                <p>Okay I will update you once the task is completed.</p>
              </div>
              <span className="chat-time_chat">Now</span>
            </li>
          </ul>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main_chat">
          <div className="chat-header_chat">
            <div className="user-avatar_chat">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="placeholder-icon_chat">
                <circle cx="12" cy="8" r="4" />
                <path d="M12 14c-5 0-9 2-9 4.5V20h18v-1.5c0-2.5-4-4.5-9-4.5z" />
              </svg>
            </div>
            <h3>John Doe</h3>
            <span className="user-status_chat">Active Now</span>
          </div>
          <div className="chat-messages_chat">
            <div className="message_chat received_chat">Hi, how are you doing?</div>
            <div className="message_chat sent_chat">I am doing great. How about you?</div>
            <div className="message_chat sent_chat">Please give me some time.</div>
            <div className="message_chat received_chat">Sure, take your time!</div>
          </div>
          <div className="chat-input_chat">
            <div className="input-actions_chat">
              <FaSmile className="emoji-icon_chat" onClick={() => setEmojiPickerVisible(!emojiPickerVisible)} />
              <FaPaperclip className="attachment-icon_chat" />
            </div>
            <input 
              type="text" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Type a message" 
            />
            <button className="send-button_chat">Send</button>
          </div>
          {emojiPickerVisible && (
            <div className="emoji-picker_chat">
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
