import React from 'react';

const MessageList = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <strong>{message.sender.username}:</strong>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
