import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBox = ({ socket, chat, user, allUsers }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to the latest message automatically
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch previous messages for the current chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:5000/api/chat/messages/${chat._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages', err);
      }
    };

    if (chat && chat._id) {
      fetchMessages();
    }
  }, [chat]);

  // Listen for realtime incoming messages so they appear immediately
  useEffect(() => {
    if (!chat) return;

    const handleMessage = (message) => {
      // Only update if the incoming message is for the current chat
      if (message.chatId === chat._id) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    };

    socket.on('message', handleMessage);
    return () => {
      socket.off('message', handleMessage);
    };
  }, [socket, chat]);

  // Auto-scroll whenever there is an update to the messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send a new message via socket; new messages will be received by the handleMessage listener
  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('chatMessage', {
        chatId: chat._id,
        senderId: user.id,
        content: newMessage,
      });
      setNewMessage('');
    }
  };

  // Get chat title: For personal chats, display the other user's name. For groups, display the group name.
  const getChatTitle = () => {
    if (chat.isGroupChat) return chat.name;
    const otherUser = chat.users.find(u => u._id !== user.id);
    return otherUser ? otherUser.username : 'Chat';
  };

  // Utility to display sender's name
  const getSenderName = (msg) => {
    const senderId = (msg.sender && msg.sender._id) ? msg.sender._id : msg.senderId;
    if (senderId === user.id) return 'Me';
    if (msg.sender && msg.sender.username) return msg.sender.username;
    if (msg.senderName) return msg.senderName;
    return allUsers.find(u => u._id === senderId)?.username || 'Unknown';
  };

  // Determine message alignment based on whether it's sent by current user
  const getMessageAlignment = (msg) => {
    const senderId = (msg.sender && msg.sender._id) ? msg.sender._id : msg.senderId;
    return senderId === user.id ? 'flex-end' : 'flex-start';
  };

  // Determine the bubble color based on who sent the message
  const getBubbleColor = (msg) => {
    const senderId = (msg.sender && msg.sender._id) ? msg.sender._id : msg.senderId;
    return senderId === user.id ? '#a5d6a7' : '#ffffff';
  };

  return (
    <div 
      className="d-flex flex-column" 
      style={{ 
        height: '100%', 
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        backgroundColor: '#f5f5f5'
      }}
    >
      <div style={{ 
            backgroundColor: '#4caf50', 
            color: '#fff', 
            padding: '10px 15px', 
            borderTopLeftRadius: '10px', 
            borderTopRightRadius: '10px',
            fontWeight: 'bold'
          }}>
        {getChatTitle()}
      </div>
      <div 
        className="flex-grow-1 p-2" 
        style={{ 
          backgroundColor: '#eceff1', 
          overflowY: 'auto'
        }}
      >
        {messages.map((msg, index) => (
          <div 
            key={index}
            className="mb-2 d-flex" 
            style={{ justifyContent: getMessageAlignment(msg) }}
          >
            <div style={{ 
                maxWidth: '75%',
                backgroundColor: getBubbleColor(msg),
                padding: '10px',
                borderRadius: '10px'
            }}>
              <small className="text-muted">{getSenderName(msg)}</small>
              <div>{msg.content}</div>
            </div>
          </div>
        ))}
        {/* Dummy element to ensure we always scroll to the latest message */}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-group" style={{ borderTop: '1px solid #ccc' }}>
        <input
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="form-control"
          placeholder="Type a message..."
          style={{ border: 'none' }}
        />
        <button className="btn btn-success" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;