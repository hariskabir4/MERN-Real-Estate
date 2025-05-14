import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSmile, FaPaperclip } from 'react-icons/fa';
import './ChatPage_1.css';

const ChatPage_1 = () => {
  const { user1Id, user2Id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const [user1Name, setUser1Name] = useState('');
  const [user2Name, setUser2Name] = useState('');
  const [userNames, setUserNames] = useState({});

  // Check if we're on the chats overview page
  const isChatsOverview = user2Id === 'chats' || !user2Id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log('Current messages:', messages);
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      console.log('Fetching chat history for user:', user1Id);
      const response = await axios.get(`http://localhost:5000/api/chat/users/${user1Id}/chats`);
      console.log('Chat history response:', response.data);
      setChatHistory(response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useEffect(() => {
    if (!isChatsOverview) {
      fetchMessages();
    }
    fetchChatHistory();
  }, [user1Id, user2Id, isChatsOverview]);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000', {
      reconnection: true,
      reconnectionAttempts: Infinity
    });

    // Connect socket event
    socketRef.current.on('connect', () => {
      console.log('Socket connected with ID:', socketRef.current.id);
      setConnected(true);

      // Join room after connection if not in overview
      if (!isChatsOverview) {
        const room = [user1Id, user2Id].sort().join('_');
        console.log('Joining room:', room);
        socketRef.current.emit('joinRoom', room);
      }
    });

    // Message listener
    socketRef.current.on('messageReceived', (newMsg) => {
      console.log('New message received on socket:', newMsg);
      setMessages(prev => {
        // Check if message already exists
        const exists = prev.some(m => m._id === newMsg._id);
        if (!exists) {
          const updatedMessages = [...prev, newMsg];
          // Sort messages by timestamp
          return updatedMessages.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          );
        }
        return prev;
      });

      // Also update chat history when receiving a new message
      fetchChatHistory();
    });

    // Add error handling for socket
    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket connection');
        socketRef.current.disconnect();
      }
    };
  }, [user1Id, user2Id, isChatsOverview]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!message.trim() || !connected) return;

    try {
      console.log('Sending message:', {
        sender: user1Id,
        receiver: user2Id,
        content: message.trim()
      });

      const res = await axios.post('http://localhost:5000/api/chat/messages', {
        sender: user1Id,
        receiver: user2Id,
        content: message.trim()
      });
      
      // Emit through socket
      const room = [user1Id, user2Id].sort().join('_');
      console.log('Emitting message to room:', room, res.data);
      socketRef.current.emit('sendMessage', { ...res.data, room });

      // Clear input
      setMessage('');
      
      // Update messages immediately
      setMessages(prev => {
        const updatedMessages = [...prev, res.data];
        return updatedMessages.sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
      });

      // Update chat history
      await fetchChatHistory();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage(message + emoji);
    setEmojiPickerVisible(false);
  };

  const handleChatClick = (otherUserId) => {
    if (otherUserId) {
      navigate(`/chat/${user1Id}/${otherUserId}`);
      // Reset message state when changing chats
      setMessage('');
      setEmojiPickerVisible(false);
    }
  };

  const filteredChats = chatHistory.filter(chat =>
    chat.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatLastMessage = (chat) => {
    if (chat.lastMessageSender === user1Id) {
      return `You: ${chat.lastMessage}`;
    } else {
      return `${chat.otherUserName}: ${chat.lastMessage}`;
    }
  };

  // Add these helper functions at the top of your component
  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateHeader = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = {
          timestamp: message.timestamp,
          messages: []
        };
      }
      groups[date].messages.push(message);
    });

    return Object.values(groups);
  };

  // Update the messages section in your render method
  const renderMessages = () => {
    try {
      return (
        <div className="chat-messages_chat">
          {groupMessagesByDate(messages).map((group, groupIndex) => (
            <div key={groupIndex} className="message-group">
              <div className="date-header">
                <span>{formatDateHeader(group.timestamp)}</span>
              </div>
              {group.messages.map((msg, msgIndex) => (
                <div
                  key={msg._id || msgIndex}
                  className={`message-wrapper ${msg.sender === user1Id ? 'sent-wrapper' : 'received-wrapper'}`}
                >
                  <div className="message-time">
                    {formatMessageTime(msg.timestamp)}
                  </div>
                  <div className={`message_chat ${msg.sender === user1Id ? 'sent_chat' : 'received_chat'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      );
    } catch (error) {
      console.error('Error rendering messages:', error);
      return <div>Error displaying messages. Please refresh the page.</div>;
    }
  };

  const fetchMessages = async () => {
    if (!isChatsOverview) {
      try {
        console.log(`Fetching messages between ${user1Id} and ${user2Id}`);
        const res = await axios.get(`http://localhost:5000/api/chat/messages/${user1Id}/${user2Id}`);
        console.log('Fetched messages:', res.data);
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    }
  };

  const fetchUserName = async (userId) => {
    if (userNames[userId]) {
      return userNames[userId];
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/chat/user/${userId}`);
      const name = response.data.name;
      setUserNames(prev => ({ ...prev, [userId]: name }));
      return name;
    } catch (error) {
      console.error('Error fetching user name:', error);
      return userId; // Fallback to ID if name fetch fails
    }
  };

  useEffect(() => {
    const fetchNames = async () => {
      if (user1Id) {
        const name1 = await fetchUserName(user1Id);
        setUser1Name(name1);
      }
      if (user2Id && !isChatsOverview) {
        const name2 = await fetchUserName(user2Id);
        setUser2Name(name2);
      }
    };
    fetchNames();
  }, [user1Id, user2Id, isChatsOverview]);

  const renderChatList = () => {
    return filteredChats.map((chat) => {
      return (
        <li
          key={chat.otherUser}
          className={`chat-item_chat ${chat.otherUser === user2Id ? 'active_chat' : ''} ${chat.unreadCount > 0 ? 'unread' : ''}`}
          onClick={() => handleChatClick(chat.otherUser)}
          style={{ cursor: 'pointer' }}
        >
          <div className="user-avatar_chat">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="placeholder-icon_chat">
              <circle cx="12" cy="8" r="4" />
              <path d="M12 14c-5 0-9 2-9 4.5V20h18v-1.5c0-2.5-4-4.5-9-4.5z" />
            </svg>
          </div>
          <div className="chat-details_chat">
            <h4>
              {chat.otherUserName}
              {chat.unreadCount > 0 && (
                <span className="unread-indicator">{chat.unreadCount}</span>
              )}
            </h4>
            <p>{formatLastMessage(chat)}</p>
          </div>
          <span className="chat-time_chat">
            {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </li>
      );
    });
  };

  // Add this effect to mark messages as read when opening a chat
  useEffect(() => {
    if (user1Id && user2Id && !isChatsOverview) {
      axios.put(`http://localhost:5000/api/chat/messages/read/${user2Id}/${user1Id}`);
    }
  }, [user1Id, user2Id, isChatsOverview]);

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
            <h3>{user1Name || 'Loading...'}</h3>
            <span className="user-status_chat">Active Now</span>
          </div>
          <div className="search-bar_chat">
            <input
              type="text"
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="chat-categories_chat">
            <button className="category_chat active_chat">All</button>
          </div>
          <ul className="chat-list_chat">
            {renderChatList()}
          </ul>
        </div>

        {/* Main Chat Area */}
        {isChatsOverview ? (
          <div className="chat-main_chat" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9f9f9'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '40px',
              maxWidth: '600px'
            }}>
              <h2 style={{
                marginBottom: '20px',
                color: '#333',
                fontSize: '24px'
              }}>Welcome to Your Chat Space!</h2>
              {chatHistory.length > 0 ? (
                <div>
                  <p style={{
                    color: '#666',
                    lineHeight: '1.6',
                    marginBottom: '15px'
                  }}>
                    Your recent conversations appear in the sidebar.
                  </p>
                  <p style={{
                    color: '#666',
                    lineHeight: '1.6'
                  }}>
                    Click on any conversation to continue chatting!
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{
                    color: '#666',
                    lineHeight: '1.6',
                    marginBottom: '15px'
                  }}>
                    You haven't started any conversations yet.
                  </p>
                  <p style={{
                    color: '#666',
                    lineHeight: '1.6'
                  }}>
                    Start chatting with others to build your chat history!
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="chat-main_chat">
            <div className="chat-header_chat">
              <div className="user-avatar_chat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="placeholder-icon_chat">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 14c-5 0-9 2-9 4.5V20h18v-1.5c0-2.5-4-4.5-9-4.5z" />
                </svg>
              </div>
              <h3>{user2Name || 'Loading...'}</h3>
              <span className="user-status_chat">Active Now</span>
            </div>
            {renderMessages()}
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
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button className="send-button_chat" onClick={sendMessage}>Send</button>
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
        )}
      </div>
    </div>
  );
};

export default ChatPage_1;
