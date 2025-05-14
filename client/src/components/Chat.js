import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../socket';

const Chat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/chat/messages/${room}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMessages(res.data.messages));

    socket.emit('joinRoom', room);
    socket.on('newMessage', (msg) => {
      if (msg.room === room) setMessages(prev => [...prev, msg]);
    });

    return () => socket.off('newMessage');
  }, [room]);

  const sendMessage = async () => {
    const res = await axios.post('http://localhost:5000/api/chat/send', {
      content: text,
      room,
      recipient: 'recipient-id'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    socket.emit('sendMessage', res.data.message);
    setText('');
  };

  return (
    <div>
      <h3>Room: {room}</h3>
      <div style={{ height: 300, overflowY: 'scroll', border: '1px solid black' }}>
        {messages.map((msg, i) => (
          <div key={i}><b>{msg.sender.username}</b>: {msg.content}</div>
        ))}
      </div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
