import React, { useState, useEffect,useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import MessageList from './MessageList';

const ChatBox = ({ user, room }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:5001');
    socket.current.emit('joinRoom', room);

    socket.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Fetch initial messages
    axios
      .get(`/api/chat/messages/${room}`)
      .then((res) => setMessages(res.data.messages))
      .catch((err) => console.error('Error fetching messages:', err));
  }, [room]);

  const handleSendMessage = () => {
    if (messageContent.trim()) {
      const newMessage = {
        sender: user._id,
        content: messageContent,
        room,
      };
      socket.current.emit('sendMessage', newMessage);
      setMessages([...messages, newMessage]);
      setMessageContent('');
    }
  };

  return (
    <div>
      <h2>Chat Room: {room}</h2>
      <MessageList messages={messages} />
      <input
        type="text"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
