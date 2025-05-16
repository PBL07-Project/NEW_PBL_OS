import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatBox = ({ socket, chat, user, allUsers }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/chat/messages/${chat._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (chat) {
      fetchMessages();
    }
  }, [chat]);


  useEffect(() => {
    socket.on('message', (message) => {
      if (message.chatId === chat._id) {
        setMessages((prev) => [...prev, message]);
      }
    });
    return () => {
      socket.off('message');
    };
  }, [socket, chat]);

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

  // Determine sender display name
  const getSenderName = (msg) => {
    if (msg.senderId === user.id) return "Me";
    return msg.senderName 
      ? msg.senderName 
      : (allUsers.find((u) => u._id === msg.senderId)?.username || "Unknown");
  };

  return (
    <div className="d-flex flex-column h-100">
      <div 
        className="flex-grow-1 border rounded p-2 mb-2" 
        style={{ backgroundColor: '#f0f0f0', maxHeight: '65vh', overflowY: 'auto' }}
      >
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className="mb-2 d-flex" 
            style={{ justifyContent: msg.senderId === user.id ? 'flex-end' : 'flex-start' }}
          >
            <div style={{ 
                  maxWidth: '75%', 
                  backgroundColor: msg.senderId === user.id ? '#dcf8c6' : '#ffffff', 
                  padding: '10px', 
                  borderRadius: '10px'
                }}>
              <small className="text-muted">{getSenderName(msg)}</small>
              <div>{msg.content}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="input-group">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="form-control"
          placeholder="Type your message..."
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;